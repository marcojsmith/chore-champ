import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireUser, requireCaregiver } from "./lib";

export const suggest = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (user.role !== "child") throw new Error("Only children can suggest rewards");

    const id = await ctx.db.insert("requestedRewards", {
      householdId: user.householdId,
      childId: user._id,
      title: args.title,
      description: args.description,
      category: args.category,
      status: "pending",
    });

    const caregivers = await ctx.db
      .query("users")
      .withIndex("by_householdId_and_role", q =>
        q.eq("householdId", user.householdId).eq("role", "caregiver")
      )
      .take(10);

    for (const caregiver of caregivers) {
      await ctx.db.insert("notifications", {
        householdId: user.householdId,
        userId: caregiver._id,
        type: "reward_requested",
        title: "New Reward Suggestion",
        body: `${user.name} suggested: "${args.title}"`,
        read: false,
      });
    }

    return id;
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    const caregiver = await requireCaregiver(ctx);
    const suggestions = await ctx.db
      .query("requestedRewards")
      .withIndex("by_householdId_and_status", q =>
        q.eq("householdId", caregiver.householdId).eq("status", "pending")
      )
      .take(100);

    const enriched = [];
    for (const s of suggestions) {
      const child = await ctx.db.get(s.childId);
      enriched.push({
        ...s,
        childName: child?.name ?? "Unknown",
        childAvatar: child?.avatar ?? "👤",
      });
    }
    return enriched;
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return await ctx.db
      .query("requestedRewards")
      .withIndex("by_childId", q => q.eq("childId", user._id))
      .order("desc")
      .take(50);
  },
});

export const approve = mutation({
  args: {
    suggestionId: v.id("requestedRewards"),
    tokenValue: v.number(),
  },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const suggestion = await ctx.db.get(args.suggestionId);

    if (!suggestion) throw new Error("Suggestion not found");
    if (suggestion.householdId !== caregiver.householdId) throw new Error("Unauthorized");
    if (suggestion.status !== "pending") throw new Error("Already resolved");

    await ctx.db.insert("rewards", {
      householdId: caregiver.householdId,
      title: suggestion.title,
      description: suggestion.description,
      tokenCost: args.tokenValue,
      category: suggestion.category ?? "Other",
      isActive: true,
      eligibleChildIds: [suggestion.childId],
    });

    await ctx.db.patch(args.suggestionId, {
      status: "approved",
      assignedTokenValue: args.tokenValue,
      resolvedAt: Date.now(),
    });

    await ctx.db.insert("notifications", {
      householdId: caregiver.householdId,
      userId: suggestion.childId,
      type: "reward_approved",
      title: "Reward Suggestion Approved! 🎉",
      body: `"${suggestion.title}" is now in your reward shop for ${args.tokenValue} tokens.`,
      read: false,
    });

    return null;
  },
});

export const reject = mutation({
  args: {
    suggestionId: v.id("requestedRewards"),
  },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const suggestion = await ctx.db.get(args.suggestionId);

    if (!suggestion) throw new Error("Suggestion not found");
    if (suggestion.householdId !== caregiver.householdId) throw new Error("Unauthorized");
    if (suggestion.status !== "pending") throw new Error("Already resolved");

    await ctx.db.patch(args.suggestionId, {
      status: "rejected",
      resolvedAt: Date.now(),
    });

    await ctx.db.insert("notifications", {
      householdId: caregiver.householdId,
      userId: suggestion.childId,
      type: "reward_rejected",
      title: "Reward Suggestion Declined",
      body: `Your suggestion "${suggestion.title}" was not approved.`,
      read: false,
    });

    return null;
  },
});