import { v } from 'convex/values'
import { query } from './_generated/server'
import { catalogKindValidator, catalogSourceValidator } from './validators'

const publicEntryValidator = v.object({
  id: v.string(),
  collectionSlug: v.string(),
  editorialNote: v.optional(v.string()),
  order: v.number(),
  item: v.object({
    uid: v.string(),
    kind: catalogKindValidator,
    source: catalogSourceValidator,
    sourceId: v.string(),
    title: v.string(),
    creators: v.array(v.string()),
    year: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    categories: v.array(v.string()),
    externalUrl: v.optional(v.string()),
    details: v.record(v.string(), v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
})

const publicArticleValidator = v.object({
  id: v.string(),
  slug: v.string(),
  title: v.string(),
  excerpt: v.optional(v.string()),
  content: v.string(),
  createdAt: v.number(),
  publishedAt: v.optional(v.number()),
})

export const listPublished = query({
  args: {},
  returns: v.array(publicEntryValidator),
  handler: async (ctx) => {
    const collections = await ctx.db.query('discoverCollections').withIndex('by_status', (q) => q.eq('status', 'published')).take(20)
    const output: Array<{
      id: string, collectionSlug: string, editorialNote?: string, order: number,
      item: {
        uid: string, kind: 'movie' | 'tv' | 'book', source: 'tmdb' | 'google-books', sourceId: string,
        title: string, creators: string[], year?: string, imageUrl?: string, description?: string,
        categories: string[], externalUrl?: string, details: Record<string, unknown>, createdAt: number, updatedAt: number,
      }
    }> = []
    for (const collection of collections) {
      const entries = await ctx.db.query('discoverEntries').withIndex('by_collection_and_order', (q) => q.eq('collectionId', collection._id)).take(100)
      for (const entry of entries) {
        const item = await ctx.db.get(entry.catalogItemId)
        if (!item) continue
        output.push({
          id: entry._id,
          collectionSlug: collection.slug,
          editorialNote: entry.editorialNote,
          order: entry.order,
          item: {
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
            details: {},
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          },
        })
      }
    }
    return output.sort((a, b) => a.order - b.order)
  },
})

export const listPublishedArticles = query({
  args: {},
  returns: v.array(publicArticleValidator),
  handler: async (ctx) => {
    const collections = await ctx.db.query('discoverCollections').withIndex('by_status', (q) => q.eq('status', 'published')).take(50)
    return collections
      .filter((collection) => collection.content !== undefined)
      .map((collection) => ({
        id: collection._id,
        slug: collection.slug,
        title: collection.title,
        excerpt: collection.excerpt,
        content: collection.content!,
        createdAt: collection.createdAt,
        publishedAt: collection.publishedAt,
      }))
      .sort((left, right) => (right.publishedAt ?? right.createdAt) - (left.publishedAt ?? left.createdAt))
  },
})

export const getPublishedArticle = query({
  args: { slug: v.string() },
  returns: v.union(publicArticleValidator, v.null()),
  handler: async (ctx, args) => {
    const collection = await ctx.db.query('discoverCollections').withIndex('by_slug', (q) => q.eq('slug', args.slug)).unique()
    if (!collection || collection.status !== 'published' || collection.content === undefined) return null
    return {
      id: collection._id,
      slug: collection.slug,
      title: collection.title,
      excerpt: collection.excerpt,
      content: collection.content,
      createdAt: collection.createdAt,
      publishedAt: collection.publishedAt,
    }
  },
})
