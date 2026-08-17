import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireAdmin } from './helpers'
import { catalogInputValidator, catalogOutputValidator } from './validators'
import { assertCatalogInput } from './helpers'

const collectionValidator = v.object({
  _id: v.id('discoverCollections'),
  slug: v.string(),
  title: v.string(),
  excerpt: v.optional(v.string()),
  status: v.union(v.literal('draft'), v.literal('published')),
  createdAt: v.number(),
  updatedAt: v.number(),
  publishedAt: v.optional(v.number()),
})

const articleValidator = v.object({
  _id: v.id('discoverCollections'),
  slug: v.string(),
  title: v.string(),
  excerpt: v.optional(v.string()),
  content: v.string(),
  status: v.union(v.literal('draft'), v.literal('published')),
  createdAt: v.number(),
  updatedAt: v.number(),
  publishedAt: v.optional(v.number()),
})

const adminEntryValidator = v.object({
  _id: v.id('discoverEntries'),
  order: v.number(),
  editorialNote: v.optional(v.string()),
  item: catalogOutputValidator,
})

export const listCollections = query({
  args: {},
  returns: v.array(collectionValidator),
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const drafts = await ctx.db.query('discoverCollections').withIndex('by_status', (q) => q.eq('status', 'draft')).take(50)
    const published = await ctx.db.query('discoverCollections').withIndex('by_status', (q) => q.eq('status', 'published')).take(50)
    return [...drafts, ...published]
      .filter((collection) => collection.content !== undefined)
      .map((collection) => ({
        _id: collection._id,
        slug: collection.slug,
        title: collection.title,
        excerpt: collection.excerpt,
        status: collection.status,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        publishedAt: collection.publishedAt,
      }))
  },
})

export const getArticle = query({
  args: { collectionId: v.id('discoverCollections') },
  returns: v.union(articleValidator, v.null()),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const collection = await ctx.db.get(args.collectionId)
    if (!collection || collection.content === undefined) return null
    return {
      _id: collection._id,
      slug: collection.slug,
      title: collection.title,
      excerpt: collection.excerpt,
      content: collection.content,
      status: collection.status,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      publishedAt: collection.publishedAt,
    }
  },
})

export const listEntries = query({
  args: { collectionId: v.id('discoverCollections') },
  returns: v.array(adminEntryValidator),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const entries = await ctx.db.query('discoverEntries').withIndex('by_collection_and_order', (q) => q.eq('collectionId', args.collectionId)).take(200)
    return Promise.all(entries.map(async (entry) => {
      const item = await ctx.db.get(entry.catalogItemId)
      if (!item) throw new Error('Discover catalogue item is missing')
      return {
        _id: entry._id,
        order: entry.order,
        editorialNote: entry.editorialNote,
        item: {
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
          details: item.details,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
      }
    }))
  },
})

export const searchCatalog = query({
  args: { query: v.string() },
  returns: v.array(catalogOutputValidator),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const queryText = args.query.trim().slice(0, 120)
    if (!queryText) return []
    const items = await ctx.db.query('catalogItems').withSearchIndex('search_title', (q) => q.search('title', queryText)).take(20)
    return items.map((item) => ({
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
      details: item.details,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
  },
})

export const saveCollection = mutation({
  args: {
    collectionId: v.optional(v.id('discoverCollections')),
    slug: v.string(),
    title: v.string(),
    excerpt: v.optional(v.string()),
    content: v.string(),
  },
  returns: v.id('discoverCollections'),
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx)
    const slug = normalizeSlug(args.slug)
    const title = args.title.trim()
    if (!title || title.length > 120) throw new Error('Collection title must be between 1 and 120 characters')
    const excerpt = cleanExcerpt(args.excerpt)
    const content = cleanContent(args.content)
    const withSlug = await ctx.db.query('discoverCollections').withIndex('by_slug', (q) => q.eq('slug', slug)).unique()
    if (withSlug && withSlug._id !== args.collectionId) throw new Error('Collection slug is already in use')
    const now = Date.now()
    if (args.collectionId) {
      const collection = await ctx.db.get(args.collectionId)
      if (!collection) throw new Error('Collection not found')
      await ctx.db.patch(args.collectionId, { slug, title, excerpt, content, updatedAt: now })
      return args.collectionId
    }
    return ctx.db.insert('discoverCollections', {
      slug,
      title,
      excerpt,
      content,
      status: 'draft',
      createdBy: admin._id,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const addEntry = mutation({
  args: { collectionId: v.id('discoverCollections'), item: catalogInputValidator, editorialNote: v.optional(v.string()) },
  returns: v.id('discoverEntries'),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const collection = await ctx.db.get(args.collectionId)
    if (!collection) throw new Error('Collection not found')
    assertCatalogInput(args.item)
    if (args.item.uid !== `${args.item.source}:${args.item.kind}:${args.item.sourceId}`) throw new Error('Catalogue UID does not match its provider identity')
    const existingItem = await ctx.db.query('catalogItems').withIndex('by_uid', (q) => q.eq('uid', args.item.uid)).unique()
    const now = Date.now()
    const catalogItemId = existingItem?._id ?? await ctx.db.insert('catalogItems', {
      ...args.item,
      createdAt: now,
      updatedAt: now,
    })
    if (existingItem) await ctx.db.patch(existingItem._id, { ...args.item, createdAt: existingItem.createdAt, updatedAt: now })
    const note = cleanNote(args.editorialNote)
    const entries = await ctx.db.query('discoverEntries').withIndex('by_collection_and_order', (q) => q.eq('collectionId', args.collectionId)).take(200)
    const existing = entries.find((entry) => entry.catalogItemId === catalogItemId)
    if (existing) return existing._id
    return ctx.db.insert('discoverEntries', {
      collectionId: args.collectionId,
      catalogItemId,
      order: entries.length,
      editorialNote: note,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const reorderEntries = mutation({
  args: { collectionId: v.id('discoverCollections'), entryIds: v.array(v.id('discoverEntries')) },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    if (args.entryIds.length > 200 || new Set(args.entryIds).size !== args.entryIds.length) throw new Error('Invalid entry order')
    const existing = await ctx.db.query('discoverEntries').withIndex('by_collection_and_order', (q) => q.eq('collectionId', args.collectionId)).take(200)
    if (existing.length !== args.entryIds.length || args.entryIds.some((id) => !existing.some((entry) => entry._id === id))) {
      throw new Error('Entry order does not match the collection')
    }
    const now = Date.now()
    await Promise.all(args.entryIds.map((entryId, order) => ctx.db.patch(entryId, { order, updatedAt: now })))
    return null
  },
})

export const updateEntry = mutation({
  args: { entryId: v.id('discoverEntries'), order: v.number(), editorialNote: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const entry = await ctx.db.get(args.entryId)
    if (!entry) throw new Error('Discover entry not found')
    if (!Number.isInteger(args.order) || args.order < 0 || args.order > 500) throw new Error('Invalid entry order')
    await ctx.db.patch(args.entryId, { order: args.order, editorialNote: cleanNote(args.editorialNote), updatedAt: Date.now() })
    return null
  },
})

export const removeEntry = mutation({
  args: { entryId: v.id('discoverEntries') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const entry = await ctx.db.get(args.entryId)
    if (entry) await ctx.db.delete(args.entryId)
    return null
  },
})

export const setPublished = mutation({
  args: { collectionId: v.id('discoverCollections'), published: v.boolean() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const collection = await ctx.db.get(args.collectionId)
    if (!collection) throw new Error('Collection not found')
    const now = Date.now()
    await ctx.db.patch(args.collectionId, {
      status: args.published ? 'published' : 'draft',
      publishedAt: args.published ? now : undefined,
      updatedAt: now,
    })
    return null
  },
})

export const deleteCollection = mutation({
  args: { collectionId: v.id('discoverCollections') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const collection = await ctx.db.get(args.collectionId)
    if (!collection) return null
    if (collection.status !== 'draft') throw new Error('Only draft articles can be deleted')

    const entries = await ctx.db.query('discoverEntries').withIndex('by_collection_and_order', (q) => q.eq('collectionId', args.collectionId)).take(200)
    await Promise.all(entries.map((entry) => ctx.db.delete(entry._id)))
    await ctx.db.delete(args.collectionId)
    return null
  },
})

function normalizeSlug(value: string) {
  const slug = value.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (!slug || slug.length > 80) throw new Error('Collection slug must be between 1 and 80 characters')
  return slug
}

function cleanNote(value?: string) {
  const note = value?.trim()
  if ((note?.length ?? 0) > 400) throw new Error('Editorial note must be 400 characters or fewer')
  return note || undefined
}

function cleanExcerpt(value?: string) {
  const excerpt = value?.trim()
  if ((excerpt?.length ?? 0) > 500) throw new Error('Excerpt must be 500 characters or fewer')
  return excerpt || undefined
}

function cleanContent(value?: string) {
  if ((value?.length ?? 0) > 120_000) throw new Error('Draft content must be 120,000 characters or fewer')
  return value
}
