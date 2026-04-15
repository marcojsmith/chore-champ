import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { requireCaregiver, requireUser } from "./lib";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCaregiver(ctx);
    const rewards = await ctx.db
      .query("rewards")
      .withIndex("by_householdId", q => q.eq("householdId", user.householdId))
      .take(100);
    return rewards;
  },
});

export const listForChild = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const rewards = await ctx.db
      .query("rewards")
      .withIndex("by_householdId_and_isActive", q => 
        q.eq("householdId", user.householdId).eq("isActive", true)
      )
      .take(100);
    const filtered = rewards.filter(r => 
      r.eligibleChildIds.length === 0 || r.eligibleChildIds.includes(user._id)
    );
    return filtered;
  },
});

export const get = query({
  args: { rewardId: v.id("rewards") },
  handler: async (ctx, args) => {
    const user = await requireCaregiver(ctx);
    const reward = await ctx.db.get(args.rewardId);
    if (!reward || reward.householdId !== user.householdId) {
      return null;
    }
    return reward;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    tokenCost: v.number(),
    category: v.string(),
    imageEmoji: v.optional(v.string()),
    eligibleChildIds: v.array(v.id("users")),
    stockQuantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireCaregiver(ctx);
    const rewardId = await ctx.db.insert("rewards", {
      householdId: user.householdId,
      title: args.title,
      description: args.description,
      tokenCost: args.tokenCost,
      category: args.category,
      imageEmoji: args.imageEmoji,
      eligibleChildIds: args.eligibleChildIds,
      stockQuantity: args.stockQuantity,
      isActive: true,
    });
    return rewardId;
  },
});

export const update = mutation({
  args: {
    rewardId: v.id("rewards"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tokenCost: v.optional(v.number()),
    category: v.optional(v.string()),
    imageEmoji: v.optional(v.string()),
    eligibleChildIds: v.optional(v.array(v.id("users"))),
    stockQuantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireCaregiver(ctx);
    const reward = await ctx.db.get(args.rewardId);
    if (!reward || reward.householdId !== user.householdId) {
      throw new Error("Reward not found");
    }
    const updateFields: Partial<Doc<"rewards">> = {};
    if (args.title !== undefined) updateFields.title = args.title;
    if (args.description !== undefined) updateFields.description = args.description;
    if (args.tokenCost !== undefined) updateFields.tokenCost = args.tokenCost;
    if (args.category !== undefined) updateFields.category = args.category;
    if (args.imageEmoji !== undefined) updateFields.imageEmoji = args.imageEmoji;
    if (args.eligibleChildIds !== undefined) updateFields.eligibleChildIds = args.eligibleChildIds;
    if (args.stockQuantity !== undefined) updateFields.stockQuantity = args.stockQuantity;
    await ctx.db.patch(args.rewardId, updateFields);
    return null;
  },
});

export const setActive = mutation({
  args: {
    rewardId: v.id("rewards"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireCaregiver(ctx);
    const reward = await ctx.db.get(args.rewardId);
    if (!reward || reward.householdId !== user.householdId) {
      throw new Error("Reward not found");
    }
    await ctx.db.patch(args.rewardId, { isActive: args.isActive });
    return null;
  },
});