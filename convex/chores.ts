import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireCaregiver, requireUser } from "./lib";
import type { Doc } from "./_generated/dataModel";

const choreArgs = {
  title: v.string(),
  description: v.string(),
  category: v.string(),
  recurrence: v.union(v.literal("once"), v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
  isRequired: v.boolean(),
  approvalMode: v.union(v.literal("auto"), v.literal("manual")),
  photoProofRequired: v.boolean(),
  baseTokens: v.number(),
  earlyCompletionBonus: v.boolean(),
  earlyBonusValue: v.number(),
  streakBonus: v.boolean(),
  streakBonusValue: v.number(),
  assignedChildIds: v.array(v.id("users")),
  dueTime: v.string(),
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    const caregiver = await requireCaregiver(ctx);
    const chores = await ctx.db
      .query("chores")
      .withIndex("by_householdId", q => q.eq("householdId", caregiver.householdId))
      .take(100);
    return chores;
  },
});

export const get = query({
  args: { choreId: v.id("chores") },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const chore = await ctx.db.get("chores", args.choreId);
    if (!chore) return null;
    if (chore.householdId !== caregiver.householdId) return null;
    return chore;
  },
});

export const getForChild = query({
  args: { choreId: v.id("chores") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const chore = await ctx.db.get("chores", args.choreId);
    if (!chore) return null;
    if (!chore.assignedChildIds.includes(user._id)) return null;
    return chore;
  },
});

export const create = mutation({
  args: choreArgs,
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const choreId = await ctx.db.insert("chores", {
      householdId: caregiver.householdId,
      title: args.title,
      description: args.description,
      category: args.category,
      recurrence: args.recurrence,
      isRequired: args.isRequired,
      approvalMode: args.approvalMode,
      photoProofRequired: args.photoProofRequired,
      baseTokens: args.baseTokens,
      earlyCompletionBonus: args.earlyCompletionBonus,
      earlyBonusValue: args.earlyBonusValue,
      streakBonus: args.streakBonus,
      streakBonusValue: args.streakBonusValue,
      assignedChildIds: args.assignedChildIds,
      isActive: true,
      dueTime: args.dueTime,
    });
    return choreId;
  },
});

const updateArgs = {
  choreId: v.id("chores"),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  category: v.optional(v.string()),
  recurrence: v.optional(v.union(v.literal("once"), v.literal("daily"), v.literal("weekly"), v.literal("monthly"))),
  isRequired: v.optional(v.boolean()),
  approvalMode: v.optional(v.union(v.literal("auto"), v.literal("manual"))),
  photoProofRequired: v.optional(v.boolean()),
  baseTokens: v.optional(v.number()),
  earlyCompletionBonus: v.optional(v.boolean()),
  earlyBonusValue: v.optional(v.number()),
  streakBonus: v.optional(v.boolean()),
  streakBonusValue: v.optional(v.number()),
  assignedChildIds: v.optional(v.array(v.id("users"))),
  dueTime: v.optional(v.string()),
};

export const update = mutation({
  args: updateArgs,
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const chore = await ctx.db.get("chores", args.choreId);
    if (!chore) throw new Error("Chore not found");
    if (chore.householdId !== caregiver.householdId) throw new Error("Unauthorized");

    const updates: Partial<Omit<Doc<"chores">, "_id" | "_creationTime">> = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.category !== undefined) updates.category = args.category;
    if (args.recurrence !== undefined) updates.recurrence = args.recurrence;
    if (args.isRequired !== undefined) updates.isRequired = args.isRequired;
    if (args.approvalMode !== undefined) updates.approvalMode = args.approvalMode;
    if (args.photoProofRequired !== undefined) updates.photoProofRequired = args.photoProofRequired;
    if (args.baseTokens !== undefined) updates.baseTokens = args.baseTokens;
    if (args.earlyCompletionBonus !== undefined) updates.earlyCompletionBonus = args.earlyCompletionBonus;
    if (args.earlyBonusValue !== undefined) updates.earlyBonusValue = args.earlyBonusValue;
    if (args.streakBonus !== undefined) updates.streakBonus = args.streakBonus;
    if (args.streakBonusValue !== undefined) updates.streakBonusValue = args.streakBonusValue;
    if (args.assignedChildIds !== undefined) updates.assignedChildIds = args.assignedChildIds;
    if (args.dueTime !== undefined) updates.dueTime = args.dueTime;

    await ctx.db.patch(args.choreId, updates);
    return null;
  },
});

export const setActive = mutation({
  args: { choreId: v.id("chores"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const chore = await ctx.db.get("chores", args.choreId);
    if (!chore) throw new Error("Chore not found");
    if (chore.householdId !== caregiver.householdId) throw new Error("Unauthorized");

    await ctx.db.patch(args.choreId, { isActive: args.isActive });
    return null;
  },
});