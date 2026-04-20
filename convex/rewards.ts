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

type SmartSuggestionResult = {
  affordable: Doc<"rewards">[];
  nearMiss: Array<Doc<"rewards"> & { tokensNeeded: number }>;
  tokenBalance: number;
};

export const getSmartSuggestions = query({
  args: {},
  handler: async (ctx): Promise<SmartSuggestionResult> => {
    const user = await requireUser(ctx);

    const stats = await ctx.db
      .query("childStats")
      .withIndex("by_childId", q => q.eq("childId", user._id))
      .unique();

    const tokenBalance = stats?.tokenBalance ?? 0;

    const rewards = await ctx.db
      .query("rewards")
      .withIndex("by_householdId_and_isActive", q =>
        q.eq("householdId", user.householdId).eq("isActive", true)
      )
      .take(100);

    const filtered = rewards.filter(r =>
      r.eligibleChildIds.length === 0 || r.eligibleChildIds.includes(user._id)
    );

    filtered.sort((a, b) => a.tokenCost - b.tokenCost);

    const affordable: Doc<"rewards">[] = [];
    const nearMiss: Array<Doc<"rewards"> & { tokensNeeded: number }> = [];

    for (const r of filtered) {
      if (r.tokenCost <= tokenBalance && affordable.length < 3) {
        affordable.push(r);
      } else if (r.tokenCost > tokenBalance && r.tokenCost <= tokenBalance + 100 && nearMiss.length < 3) {
        nearMiss.push({ ...r, tokensNeeded: r.tokenCost - tokenBalance });
      }
    }

    return { affordable, nearMiss, tokenBalance };
  },
});