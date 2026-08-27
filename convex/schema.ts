import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

const kind = v.union(v.literal('movie'), v.literal('tv'), v.literal('book'))
const source = v.union(v.literal('tmdb'), v.literal('google-books'))

export default defineSchema({
  users: defineTable({
    subject: v.string(),
    role: v.union(v.literal('user'), v.literal('admin')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_subject', ['subject'])
    .index('by_role', ['role']),

  catalogItems: defineTable({
    uid: v.string(),
    kind,
    source,
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
    .index('by_uid', ['uid'])
    .index('by_kind', ['kind'])
    .searchIndex('search_title', { searchField: 'title', filterFields: ['kind'] }),

  libraryEntries: defineTable({
    ownerId: v.id('users'),
    catalogItemId: v.id('catalogItems'),
    uid: v.string(),
    sourceUrl: v.optional(v.string()),
    state: v.union(v.literal('saved'), v.literal('completed')),
    addedAt: v.number(),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
    revision: v.optional(v.number()),
  })
    .index('by_owner', ['ownerId'])
    .index('by_owner_and_uid', ['ownerId', 'uid'])
    .index('by_owner_and_state', ['ownerId', 'state']),

  discoverCollections: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.union(v.literal('draft'), v.literal('published')),
    createdBy: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
  })
    .index('by_status', ['status'])
    .index('by_slug', ['slug']),

  discoverEntries: defineTable({
    collectionId: v.id('discoverCollections'),
    catalogItemId: v.id('catalogItems'),
    order: v.number(),
    editorialNote: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_collection_and_order', ['collectionId', 'order'])
    .index('by_catalog_item', ['catalogItemId']),

  syncOperations: defineTable({
    ownerId: v.id('users'),
    operationId: v.string(),
    operationType: v.union(v.literal('upsert'), v.literal('state'), v.literal('delete')),
    uid: v.string(),
    processedAt: v.number(),
  }).index('by_owner_and_operation', ['ownerId', 'operationId']),
})
