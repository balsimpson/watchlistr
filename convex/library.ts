import { v, type Infer } from 'convex/values'
import { mutation, query, type MutationCtx } from './_generated/server'
import type { Id } from './_generated/dataModel'
import { assertCatalogInput, ensureUser, requireUser } from './helpers'
import { catalogInputValidator, libraryEntryOutputValidator, libraryStateValidator } from './validators'

export const list = query({
  args: {},
  returns: v.array(libraryEntryOutputValidator),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Authentication required')
    const user = await ctx.db.query('users').withIndex('by_subject', (q) => q.eq('subject', identity.subject)).unique()
    if (!user) return []
    const entries = await ctx.db.query('libraryEntries').withIndex('by_owner', (q) => q.eq('ownerId', user._id)).take(1000)
    return Promise.all(entries.map(async (entry) => {
      const item = await ctx.db.get(entry.catalogItemId)
      if (!item) throw new Error(`Missing catalogue item for ${entry.uid}`)
      return {
        _id: entry._id,
        uid: entry.uid,
        sourceUrl: entry.sourceUrl,
        state: entry.state,
        addedAt: entry.addedAt,
        completedAt: entry.completedAt,
        updatedAt: entry.updatedAt,
        deletedAt: entry.deletedAt,
        revision: entry.revision,
        item: publicCatalogItem(item, entry.sourceUrl),
      }
    }))
  },
})

export const upsert = mutation({
  args: {
    operationId: v.string(),
    expectedRevision: v.optional(v.number()),
    item: catalogInputValidator,
    sourceUrl: v.optional(v.string()),
    state: libraryStateValidator,
    addedAt: v.number(),
    completedAt: v.optional(v.number()),
  },
  returns: v.object({ applied: v.boolean(), uid: v.string(), updatedAt: v.number() }),
  handler: async (ctx, args) => {
    const ownerId = await ensureUser(ctx)
    const replay = await findOperation(ctx, ownerId, args.operationId)
    if (replay) return { applied: false, uid: replay.uid, updatedAt: replay.processedAt }
    validateOperationId(args.operationId)
    assertCatalogInput(args.item)
    assertUid(args.item.uid, args.item.source, args.item.kind, args.item.sourceId)

    const now = Date.now()
    const sourceUrl = args.sourceUrl ?? args.item.sourceUrl
    assertCatalogInput({ ...args.item, sourceUrl })
    const catalogItemId = await upsertCatalogItem(ctx, args.item, now)
    const existing = await ctx.db.query('libraryEntries').withIndex('by_owner_and_uid', (q) => q.eq('ownerId', ownerId).eq('uid', args.item.uid)).unique()
    if (existing) {
      if (existing.deletedAt !== undefined && args.expectedRevision !== existing.revision) {
        await recordOperation(ctx, ownerId, args.operationId, 'upsert', args.item.uid, now)
        return { applied: false, uid: args.item.uid, updatedAt: existing.updatedAt }
      }
      const state = existing.state === 'completed' || args.state === 'completed' ? 'completed' : 'saved'
      const completedAt = state === 'completed'
        ? Math.max(existing.completedAt ?? 0, args.completedAt ?? now)
        : undefined
      await ctx.db.patch(existing._id, {
        catalogItemId,
        state,
        sourceUrl: sourceUrl ?? existing.sourceUrl,
        addedAt: Math.min(existing.addedAt, args.addedAt),
        completedAt,
        updatedAt: now,
        deletedAt: undefined,
        revision: (existing.revision ?? 0) + 1,
      })
    } else {
      await ctx.db.insert('libraryEntries', {
        ownerId,
        catalogItemId,
        uid: args.item.uid,
        sourceUrl,
        state: args.state,
        addedAt: args.addedAt,
        completedAt: args.state === 'completed' ? args.completedAt ?? now : undefined,
        updatedAt: now,
        revision: 1,
      })
    }
    await recordOperation(ctx, ownerId, args.operationId, 'upsert', args.item.uid, now)
    return { applied: true, uid: args.item.uid, updatedAt: now }
  },
})

export const importBatch = mutation({
  args: {
    batchId: v.string(),
    entries: v.array(v.object({
      item: catalogInputValidator,
      sourceUrl: v.optional(v.string()),
      state: libraryStateValidator,
      addedAt: v.number(),
      completedAt: v.optional(v.number()),
    })),
  },
  returns: v.object({ applied: v.boolean(), imported: v.number(), updatedAt: v.number() }),
  handler: async (ctx, args) => {
    const ownerId = await ensureUser(ctx)
    validateOperationId(args.batchId)
    if (args.entries.length < 1 || args.entries.length > 50) throw new Error('Import batches must contain between 1 and 50 entries')
    const replay = await findOperation(ctx, ownerId, args.batchId)
    if (replay) return { applied: false, imported: args.entries.length, updatedAt: replay.processedAt }

    const now = Date.now()
    for (const entry of args.entries) {
      assertCatalogInput(entry.item)
      assertUid(entry.item.uid, entry.item.source, entry.item.kind, entry.item.sourceId)
      const sourceUrl = entry.sourceUrl ?? entry.item.sourceUrl
      assertCatalogInput({ ...entry.item, sourceUrl })
      const catalogItemId = await upsertCatalogItem(ctx, entry.item, now)
      const existing = await ctx.db.query('libraryEntries').withIndex('by_owner_and_uid', (q) => q.eq('ownerId', ownerId).eq('uid', entry.item.uid)).unique()
      if (existing) {
        const state = existing.state === 'completed' || entry.state === 'completed' ? 'completed' : 'saved'
        await ctx.db.patch(existing._id, {
          catalogItemId,
          state,
          sourceUrl: sourceUrl ?? existing.sourceUrl,
          addedAt: Math.min(existing.addedAt, entry.addedAt),
          completedAt: state === 'completed'
            ? Math.max(existing.completedAt ?? 0, entry.completedAt ?? now)
            : undefined,
          updatedAt: now,
          deletedAt: undefined,
          revision: (existing.revision ?? 0) + 1,
        })
      } else {
        await ctx.db.insert('libraryEntries', {
          ownerId,
          catalogItemId,
          uid: entry.item.uid,
          sourceUrl,
          state: entry.state,
          addedAt: entry.addedAt,
          completedAt: entry.state === 'completed' ? entry.completedAt ?? now : undefined,
          updatedAt: now,
          revision: 1,
        })
      }
    }
    await recordOperation(ctx, ownerId, args.batchId, 'upsert', `import:${args.entries.length}`, now)
    return { applied: true, imported: args.entries.length, updatedAt: now }
  },
})

export const updateState = mutation({
  args: { operationId: v.string(), uid: v.string(), state: libraryStateValidator },
  returns: v.object({ applied: v.boolean(), uid: v.string(), updatedAt: v.number() }),
  handler: async (ctx, args) => {
    const owner = await requireUser(ctx)
    const replay = await findOperation(ctx, owner._id, args.operationId)
    if (replay) return { applied: false, uid: replay.uid, updatedAt: replay.processedAt }
    validateOperationId(args.operationId)
    const entry = await ctx.db.query('libraryEntries').withIndex('by_owner_and_uid', (q) => q.eq('ownerId', owner._id).eq('uid', args.uid)).unique()
    if (!entry) throw new Error('Library item not found')
    const now = Date.now()
    if (entry.deletedAt !== undefined) {
      await recordOperation(ctx, owner._id, args.operationId, 'state', args.uid, now)
      return { applied: false, uid: args.uid, updatedAt: entry.updatedAt }
    }
    await ctx.db.patch(entry._id, {
      state: args.state,
      completedAt: args.state === 'completed' ? now : undefined,
      updatedAt: now,
      revision: (entry.revision ?? 0) + 1,
    })
    await recordOperation(ctx, owner._id, args.operationId, 'state', args.uid, now)
    return { applied: true, uid: args.uid, updatedAt: now }
  },
})

export const remove = mutation({
  args: { operationId: v.string(), uid: v.string() },
  returns: v.object({ applied: v.boolean(), uid: v.string(), updatedAt: v.number() }),
  handler: async (ctx, args) => {
    const owner = await requireUser(ctx)
    const replay = await findOperation(ctx, owner._id, args.operationId)
    if (replay) return { applied: false, uid: replay.uid, updatedAt: replay.processedAt }
    validateOperationId(args.operationId)
    const entry = await ctx.db.query('libraryEntries').withIndex('by_owner_and_uid', (q) => q.eq('ownerId', owner._id).eq('uid', args.uid)).unique()
    const now = Date.now()
    if (entry) await ctx.db.patch(entry._id, { deletedAt: now, updatedAt: now, revision: (entry.revision ?? 0) + 1 })
    await recordOperation(ctx, owner._id, args.operationId, 'delete', args.uid, now)
    return { applied: true, uid: args.uid, updatedAt: now }
  },
})

async function upsertCatalogItem(ctx: MutationCtx, item: Infer<typeof catalogInputValidator>, now: number): Promise<Id<'catalogItems'>> {
  const existing = await ctx.db.query('catalogItems').withIndex('by_uid', (q) => q.eq('uid', item.uid)).unique()
  const value = {
    uid: item.uid,
    kind: item.kind,
    source: item.source,
    sourceId: item.sourceId,
    title: item.title,
    creators: item.creators,
    year: item.year,
    imageUrl: item.imageUrl,
    description: item.description,
    categories: item.categories,
    externalUrl: item.externalUrl,
    details: item.details,
    updatedAt: now,
  }
  if (existing) {
    await ctx.db.patch(existing._id, value)
    return existing._id
  }
  return ctx.db.insert('catalogItems', { ...value, createdAt: now })
}

async function findOperation(ctx: MutationCtx, ownerId: Id<'users'>, operationId: string) {
  return ctx.db.query('syncOperations').withIndex('by_owner_and_operation', (q) => q.eq('ownerId', ownerId).eq('operationId', operationId)).unique()
}

async function recordOperation(ctx: MutationCtx, ownerId: Id<'users'>, operationId: string, operationType: 'upsert' | 'state' | 'delete', uid: string, processedAt: number) {
  await ctx.db.insert('syncOperations', { ownerId, operationId, operationType, uid, processedAt })
}

function validateOperationId(value: string) {
  if (!value || value.length > 120) throw new Error('Invalid operation ID')
}

function assertUid(uid: string, source: string, kind: string, sourceId: string) {
  const expected = `${source}:${kind}:${sourceId}`
  if (uid !== expected) throw new Error('Catalogue UID does not match its provider identity')
}

function publicCatalogItem(item: {
  _id: Id<'catalogItems'>, uid: string, kind: 'movie' | 'tv' | 'book', source: 'tmdb' | 'google-books', sourceId: string,
  title: string, creators: string[], year?: string, imageUrl?: string, description?: string, categories: string[],
  externalUrl?: string, details: Record<string, unknown>, createdAt: number, updatedAt: number,
}, sourceUrl?: string) {
  return {
    _id: item._id,
    uid: item.uid,
    kind: item.kind,
    source: item.source,
    sourceId: item.sourceId,
    title: item.title,
    creators: item.creators,
    year: item.year,
    imageUrl: item.imageUrl,
    description: item.description,
    categories: item.categories,
    externalUrl: item.externalUrl,
    sourceUrl,
    details: item.details,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}
