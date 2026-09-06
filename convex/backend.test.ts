/// <reference types="vite/client" />

import { convexTest } from 'convex-test'
import { makeFunctionReference } from 'convex/server'
import { describe, expect, it } from 'vitest'
import schema from './schema'

const modules = import.meta.glob(['./**/*.ts', './_generated/*.js', '!./**/*.test.ts'])

const initialize = makeFunctionReference<'mutation'>('users:initialize')
const listLibrary = makeFunctionReference<'query'>('library:list')
const upsertLibrary = makeFunctionReference<'mutation'>('library:upsert')
const importBatch = makeFunctionReference<'mutation'>('library:importBatch')
const updateLibraryState = makeFunctionReference<'mutation'>('library:updateState')
const removeLibrary = makeFunctionReference<'mutation'>('library:remove')
const saveCollection = makeFunctionReference<'mutation'>('admin:saveCollection')
const addDiscoverEntry = makeFunctionReference<'mutation'>('admin:addEntry')
const removeDiscoverEntry = makeFunctionReference<'mutation'>('admin:removeEntry')
const reorderDiscoverEntries = makeFunctionReference<'mutation'>('admin:reorderEntries')
const listAdminEntries = makeFunctionReference<'query'>('admin:listEntries')
const searchAdminCatalog = makeFunctionReference<'query'>('admin:searchCatalog')
const setPublished = makeFunctionReference<'mutation'>('admin:setPublished')
const listPublished = makeFunctionReference<'query'>('discover:listPublished')

describe('private library boundaries', () => {
  it('rejects anonymous private reads and isolates two identities', async () => {
    const t = convexTest(schema, modules)
    await expect(t.query(listLibrary, {})).rejects.toThrow('Authentication required')

    const asA = t.withIdentity({ subject: 'user-a', tokenIdentifier: 'issuer|user-a' })
    const asB = t.withIdentity({ subject: 'user-b', tokenIdentifier: 'issuer|user-b' })
    await asA.mutation(initialize, {})
    await asB.mutation(initialize, {})
    await asA.mutation(upsertLibrary, {
      operationId: 'add-a-1',
      item: item('tmdb:movie:238', 'The Godfather'),
      state: 'saved',
      addedAt: 10,
    })

    expect(await asA.query(listLibrary, {})).toHaveLength(1)
    expect(await asB.query(listLibrary, {})).toEqual([])

    await expect(asB.mutation(updateLibraryState, {
      operationId: 'state-a-from-b',
      uid: 'tmdb:movie:238',
      state: 'completed',
    })).rejects.toThrow('Library item not found')
    await asB.mutation(removeLibrary, { operationId: 'remove-a-from-b', uid: 'tmdb:movie:238' })

    const [entryA] = await asA.query(listLibrary, {}) as Array<{ state: string, deletedAt?: number }>
    expect(entryA).toMatchObject({ state: 'saved' })
    expect(entryA?.deletedAt).toBeUndefined()
  })

  it('keeps source URLs on each owner library entry', async () => {
    const t = convexTest(schema, modules)
    const asA = t.withIdentity({ subject: 'user-a', tokenIdentifier: 'issuer|user-a' })
    const asB = t.withIdentity({ subject: 'user-b', tokenIdentifier: 'issuer|user-b' })
    await asA.mutation(initialize, {})
    await asB.mutation(initialize, {})

    await asA.mutation(upsertLibrary, {
      operationId: 'source-a',
      item: item('tmdb:movie:238', 'The Godfather'),
      sourceUrl: 'https://example.com/a',
      state: 'saved',
      addedAt: 10,
    })
    await asB.mutation(upsertLibrary, {
      operationId: 'source-b',
      item: item('tmdb:movie:238', 'The Godfather'),
      sourceUrl: 'https://example.com/b',
      state: 'saved',
      addedAt: 10,
    })

    const [entryA] = await asA.query(listLibrary, {}) as Array<{ sourceUrl?: string, item: { sourceUrl?: string } }>
    const [entryB] = await asB.query(listLibrary, {}) as Array<{ sourceUrl?: string, item: { sourceUrl?: string } }>
    expect(entryA).toMatchObject({ sourceUrl: 'https://example.com/a', item: { sourceUrl: 'https://example.com/a' } })
    expect(entryB).toMatchObject({ sourceUrl: 'https://example.com/b', item: { sourceUrl: 'https://example.com/b' } })
  })

  it('deduplicates replayed operations and keeps Finished precedence during import', async () => {
    const t = convexTest(schema, modules)
    const asUser = t.withIdentity({ subject: 'user-a', tokenIdentifier: 'issuer|user-a' })
    await asUser.mutation(initialize, {})
    const args = {
      operationId: 'same-operation',
      item: item('tmdb:tv:1396', 'Breaking Bad'),
      state: 'saved' as const,
      addedAt: 50,
    }
    expect((await asUser.mutation(upsertLibrary, args) as { applied: boolean }).applied).toBe(true)
    expect((await asUser.mutation(upsertLibrary, args) as { applied: boolean }).applied).toBe(false)

    await asUser.mutation(importBatch, {
      batchId: 'import-batch-1',
      entries: [{
        item: item('tmdb:tv:1396', 'Breaking Bad'),
        state: 'completed',
        addedAt: 10,
        completedAt: 80,
      }],
    })
    const entries = await asUser.query(listLibrary, {}) as Array<{ state: string, addedAt: number, completedAt?: number }>
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({ state: 'completed', addedAt: 10, completedAt: 80 })
  })

  it('keeps tombstones visible for synchronization and rejects stale restoration', async () => {
    const t = convexTest(schema, modules)
    const asUser = t.withIdentity({ subject: 'user-a', tokenIdentifier: 'issuer|user-a' })
    await asUser.mutation(initialize, {})
    await asUser.mutation(upsertLibrary, {
      operationId: 'add-before-delete',
      item: item('tmdb:movie:238', 'The Godfather'),
      state: 'saved',
      addedAt: 10,
    })
    const [active] = await asUser.query(listLibrary, {}) as Array<{ revision?: number, deletedAt?: number }>
    expect(active?.revision).toBe(1)

    await asUser.mutation(removeLibrary, { operationId: 'delete-on-a', uid: 'tmdb:movie:238' })
    const [deleted] = await asUser.query(listLibrary, {}) as Array<{ revision?: number, deletedAt?: number }>
    expect(deleted).toMatchObject({ revision: 2 })
    expect(deleted?.deletedAt).toEqual(expect.any(Number))

    const staleState = await asUser.mutation(updateLibraryState, {
      operationId: 'stale-state-from-b',
      uid: 'tmdb:movie:238',
      state: 'completed',
    }) as { applied: boolean }
    expect(staleState.applied).toBe(false)

    const staleAdd = await asUser.mutation(upsertLibrary, {
      operationId: 'stale-add-from-b',
      expectedRevision: active?.revision,
      item: item('tmdb:movie:238', 'The Godfather'),
      state: 'saved',
      addedAt: 10,
    }) as { applied: boolean }
    expect(staleAdd.applied).toBe(false)
    expect((await asUser.query(listLibrary, {}) as Array<{ deletedAt?: number }>)[0]?.deletedAt).toEqual(expect.any(Number))

    const explicitReAdd = await asUser.mutation(upsertLibrary, {
      operationId: 'newer-explicit-re-add',
      expectedRevision: deleted?.revision,
      item: item('tmdb:movie:238', 'The Godfather'),
      state: 'saved',
      addedAt: 10,
    }) as { applied: boolean }
    expect(explicitReAdd.applied).toBe(true)
    const [restored] = await asUser.query(listLibrary, {}) as Array<{ revision?: number, deletedAt?: number }>
    expect(restored?.revision).toBe(3)
    expect(restored?.deletedAt).toBeUndefined()
  })
})

describe('Discover publication and admin enforcement', () => {
  it('shows only published entries and rejects a normal user from admin mutations', async () => {
    const t = convexTest(schema, modules)
    const asAdmin = t.withIdentity({ subject: 'admin-subject', tokenIdentifier: 'issuer|admin-subject' })
    const asUser = t.withIdentity({ subject: 'user-subject', tokenIdentifier: 'issuer|user-subject' })
    await asAdmin.mutation(initialize, {})
    await asUser.mutation(initialize, {})
    await t.run(async (ctx) => {
      const user = await ctx.db.query('users').withIndex('by_subject', (q) => q.eq('subject', 'admin-subject')).unique()
      if (!user) throw new Error('Test user is missing')
      await ctx.db.patch(user._id, { role: 'admin' })
    })

    await expect(asUser.mutation(saveCollection, article('weekend-picks', 'Weekend picks')))
      .rejects.toThrow('Administrator access required')
    await expect(asUser.query(searchAdminCatalog, { query: 'Midnight' }))
      .rejects.toThrow('Administrator access required')

    const collectionId = await asAdmin.mutation(saveCollection, article('weekend-picks', 'Weekend picks'))
    const entryId = await asAdmin.mutation(addDiscoverEntry, {
      collectionId,
      item: item('google-books:book:abc', 'The Midnight Library'),
      editorialNote: 'A humane story about regret and possibility.',
    })
    await expect(asUser.mutation(addDiscoverEntry, {
      collectionId,
      item: item('tmdb:movie:238', 'The Godfather'),
    })).rejects.toThrow('Administrator access required')
    await expect(asUser.mutation(reorderDiscoverEntries, { collectionId, entryIds: [entryId] }))
      .rejects.toThrow('Administrator access required')
    await expect(asUser.mutation(removeDiscoverEntry, { entryId }))
      .rejects.toThrow('Administrator access required')
    await expect(asUser.mutation(setPublished, { collectionId, published: true }))
      .rejects.toThrow('Administrator access required')
    const catalogMatches = await asAdmin.query(searchAdminCatalog, { query: 'Midnight' }) as Array<{ uid: string }>
    expect(catalogMatches.map((match) => match.uid)).toContain('google-books:book:abc')
    expect(await t.query(listPublished, {})).toEqual([])

    await asAdmin.mutation(setPublished, { collectionId, published: true })
    const published = await t.query(listPublished, {}) as Array<{ item: { uid: string }, editorialNote?: string }>
    expect(published).toHaveLength(1)
    expect(published[0]).toMatchObject({
      item: { uid: 'google-books:book:abc' },
      editorialNote: 'A humane story about regret and possibility.',
    })

    await asAdmin.mutation(setPublished, { collectionId, published: false })
    expect(await t.query(listPublished, {})).toEqual([])
  })

  it('persists a deterministic admin feed order', async () => {
    const t = convexTest(schema, modules)
    const asAdmin = t.withIdentity({ subject: 'admin-subject', tokenIdentifier: 'issuer|admin-subject' })
    await asAdmin.mutation(initialize, {})
    await t.run(async (ctx) => {
      const user = await ctx.db.query('users').withIndex('by_subject', (q) => q.eq('subject', 'admin-subject')).unique()
      if (!user) throw new Error('Test user is missing')
      await ctx.db.patch(user._id, { role: 'admin' })
    })
    const collectionId = await asAdmin.mutation(saveCollection, article('ordered', 'Ordered'))
    const firstId = await asAdmin.mutation(addDiscoverEntry, { collectionId, item: item('tmdb:movie:238', 'The Godfather') })
    const secondId = await asAdmin.mutation(addDiscoverEntry, { collectionId, item: item('tmdb:tv:1396', 'Breaking Bad') })

    await asAdmin.mutation(reorderDiscoverEntries, { collectionId, entryIds: [secondId, firstId] })
    const ordered = await asAdmin.query(listAdminEntries, { collectionId }) as Array<{ _id: string, order: number }>
    expect(ordered.map((entry) => [entry._id, entry.order])).toEqual([[secondId, 0], [firstId, 1]])
  })

  it('rejects executable URL schemes from catalogue input', async () => {
    const t = convexTest(schema, modules)
    const asUser = t.withIdentity({ subject: 'user-a', tokenIdentifier: 'issuer|user-a' })
    await asUser.mutation(initialize, {})
    await expect(asUser.mutation(upsertLibrary, {
      operationId: 'unsafe-url',
      item: { ...item('tmdb:movie:238', 'The Godfather'), imageUrl: 'javascript:alert(1)' },
      state: 'saved',
      addedAt: 10,
    })).rejects.toThrow('Image URL must use HTTP or HTTPS')
    await expect(asUser.mutation(upsertLibrary, {
      operationId: 'unsafe-source-url',
      item: item('tmdb:movie:238', 'The Godfather'),
      sourceUrl: 'javascript:alert(1)',
      state: 'saved',
      addedAt: 10,
    })).rejects.toThrow('Source URL must use HTTP or HTTPS')
  })
})

function article(slug: string, title: string) {
  return {
    slug,
    title,
    content: `# ${title}`,
  }
}

function item(uid: string, title: string) {
  const parts = uid.split(':')
  const source = parts[0] as 'tmdb' | 'google-books'
  const kind = parts[1] as 'movie' | 'tv' | 'book'
  return {
    uid,
    kind,
    source,
    sourceId: parts[2]!,
    title,
    creators: kind === 'book' ? ['Matt Haig'] : [],
    categories: [],
    details: {},
    createdAt: 1,
    updatedAt: 1,
  }
}
