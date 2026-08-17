import { v } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'
import { ensureUser, requireUser } from './helpers'

export const initialize = mutation({
  args: {},
  returns: v.object({ role: v.union(v.literal('user'), v.literal('admin')) }),
  handler: async (ctx) => {
    const userId = await ensureUser(ctx)
    const user = await ctx.db.get(userId)
    if (!user) throw new Error('Watchlistr account could not be initialized')
    return { role: user.role }
  },
})

export const current = query({
  args: {},
  returns: v.object({ role: v.union(v.literal('user'), v.literal('admin')), subjectSuffix: v.string() }),
  handler: async (ctx) => {
    const user = await requireUser(ctx)
    return { role: user.role, subjectSuffix: user.subject.slice(-8) }
  },
})

export const assignFirstAdmin = internalMutation({
  args: { subject: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const admin = await ctx.db.query('users').withIndex('by_role', (q) => q.eq('role', 'admin')).first()
    if (admin) throw new Error('An administrator already exists')
    const user = await ctx.db.query('users').withIndex('by_subject', (q) => q.eq('subject', args.subject)).unique()
    if (!user) throw new Error('The specified Auth0 subject has not initialized Watchlistr')
    await ctx.db.patch(user._id, { role: 'admin', updatedAt: Date.now() })
    return null
  },
})
