import type { MutationCtx, QueryCtx } from './_generated/server'
import type { Id } from './_generated/dataModel'

export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error('Authentication required')
  const user = await ctx.db.query('users').withIndex('by_subject', (q) => q.eq('subject', identity.subject)).unique()
  if (!user) throw new Error('Watchlistr account is not initialized')
  return user
}

export async function ensureUser(ctx: MutationCtx): Promise<Id<'users'>> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error('Authentication required')
  const existing = await ctx.db.query('users').withIndex('by_subject', (q) => q.eq('subject', identity.subject)).unique()
  const now = Date.now()
  if (existing) {
    await ctx.db.patch(existing._id, { updatedAt: now })
    return existing._id
  }
  return ctx.db.insert('users', { subject: identity.subject, role: 'user', createdAt: now, updatedAt: now })
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await requireUser(ctx)
  if (user.role !== 'admin') throw new Error('Administrator access required')
  return user
}

export function assertCatalogInput(item: {
  uid: string, sourceId: string, title: string, creators: string[], categories: string[],
  year?: string, description?: string, imageUrl?: string, externalUrl?: string, sourceUrl?: string, details?: Record<string, unknown>,
}) {
  if (item.uid.length > 180 || item.sourceId.length > 120 || item.title.length > 300) throw new Error('Catalogue item is too long')
  if (item.creators.length > 24 || item.creators.some((value) => value.length > 160)) throw new Error('Creator list is too long')
  if (item.categories.length > 40 || item.categories.some((value) => value.length > 100)) throw new Error('Category list is too long')
  if ((item.description?.length ?? 0) > 8_000) throw new Error('Description is too long')
  if ((item.year?.length ?? 0) > 20) throw new Error('Year is too long')
  if ((item.imageUrl?.length ?? 0) > 2_000 || (item.externalUrl?.length ?? 0) > 2_000 || (item.sourceUrl?.length ?? 0) > 2_000) throw new Error('URL is too long')
  if (item.imageUrl && !isSafeWebUrl(item.imageUrl)) throw new Error('Image URL must use HTTP or HTTPS')
  if (item.externalUrl && !isSafeWebUrl(item.externalUrl)) throw new Error('External URL must use HTTP or HTTPS')
  if (item.sourceUrl && !isSafeWebUrl(item.sourceUrl)) throw new Error('Source URL must use HTTP or HTTPS')
  if (JSON.stringify(item.details ?? {}).length > 8_000) throw new Error('Catalogue details are too long')
}

function isSafeWebUrl(value: string) {
  try {
    const protocol = new URL(value).protocol
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}
