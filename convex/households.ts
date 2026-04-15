import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, requireCaregiver } from "./lib";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existingUser) {
      return existingUser.householdId;
    }

    const householdId = await ctx.db.insert("households", {
      name: args.name,
      createdBy: identity.tokenIdentifier,
    });

    await ctx.db.insert("users", {
      householdId,
      tokenIdentifier: identity.tokenIdentifier,
      role: "caregiver",
      name: identity.name ?? "Caregiver",
      avatar: "👩",
      isActive: true,
    });

    return householdId;
  },
});

export const getMyHousehold = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const household = await ctx.db.get("households", user.householdId);
    return household;
  },
});

export const updateHousehold = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    await ctx.db.patch(caregiver.householdId, { name: args.name });
    return null;
  },
});