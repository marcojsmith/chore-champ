import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireCaregiver } from "./lib";

export const createInvite = mutation({
  args: { childId: v.id("users") },
  returns: v.string(),
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const child = await ctx.db.get("users", args.childId);

    if (!child) throw new Error("Child not found");
    if (child.householdId !== caregiver.householdId) throw new Error("Unauthorized");
    if (child.role !== "child") throw new Error("Not a child");

    const existingInvites = await ctx.db
      .query("invites")
      .withIndex("by_childId", q => q.eq("childId", args.childId))
      .take(10);

    for (const invite of existingInvites) {
      if (!invite.usedAt) {
        await ctx.db.delete(invite._id);
      }
    }

    const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    await ctx.db.insert("invites", {
      householdId: caregiver.householdId,
      childId: args.childId,
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return token;
  },
});

export const getInviteInfo = query({
  args: { token: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      householdName: v.string(),
      childName: v.string(),
      childAvatar: v.string(),
      isExpired: v.boolean(),
      isUsed: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_token", q => q.eq("token", args.token))
      .unique();

    if (!invite) return null;

    const household = await ctx.db.get("households", invite.householdId);
    const child = await ctx.db.get("users", invite.childId);

    if (!household || !child) return null;

    return {
      householdName: household.name,
      childName: child.name,
      childAvatar: child.avatar,
      isExpired: invite.expiresAt < Date.now(),
      isUsed: !!invite.usedAt,
    };
  },
});

export const acceptInvite = mutation({
  args: { token: v.string() },
  returns: v.object({
    childId: v.id("users"),
    householdId: v.id("households"),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const invite = await ctx.db
      .query("invites")
      .withIndex("by_token", q => q.eq("token", args.token))
      .unique();

    if (!invite) throw new Error("Invite not found");
    if (invite.expiresAt < Date.now()) throw new Error("Invite has expired");
    if (invite.usedAt) throw new Error("Invite already used");

    const child = await ctx.db.get("users", invite.childId);
    if (!child) throw new Error("Child not found");
    if (child.tokenIdentifier) throw new Error("Child account already linked");

    await ctx.db.patch(invite.childId, { tokenIdentifier: identity.tokenIdentifier });
    await ctx.db.patch(invite._id, { usedAt: Date.now() });

    return {
      childId: invite.childId,
      householdId: invite.householdId,
    };
  },
});