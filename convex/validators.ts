import { v } from 'convex/values'

export const catalogKindValidator = v.union(v.literal('movie'), v.literal('tv'), v.literal('book'))
export const catalogSourceValidator = v.union(v.literal('tmdb'), v.literal('google-books'))
export const libraryStateValidator = v.union(v.literal('saved'), v.literal('completed'))

export const catalogInputValidator = v.object({
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
  sourceUrl: v.optional(v.string()),
  details: v.record(v.string(), v.any()),
  createdAt: v.number(),
  updatedAt: v.number(),
})

export const catalogOutputValidator = v.object({
  _id: v.id('catalogItems'),
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
  sourceUrl: v.optional(v.string()),
  details: v.record(v.string(), v.any()),
  createdAt: v.number(),
  updatedAt: v.number(),
})

export const libraryEntryOutputValidator = v.object({
  _id: v.id('libraryEntries'),
  uid: v.string(),
  state: libraryStateValidator,
  addedAt: v.number(),
  completedAt: v.optional(v.number()),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
  revision: v.optional(v.number()),
  item: catalogOutputValidator,
})
