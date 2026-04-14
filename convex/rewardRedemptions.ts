import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { requireCaregiver, requireUser } from "./lib";

type RedemptionWithDetails = {
  redemption: Doc<"rewardRedemptions">;
  rewardTitle: string;
  childName: string;
};

export const listPending = query({
  args: {},
  handler: async (ctx): Promise<RedemptionWithDetails[]> => {
    const user = await requireCaregiver(ctx);
    const redemptions = await ctx.db
      .query("rewardRedemptions")
      .withIndex("by_householdId_and_status", q =>
        q.eq("householdId", user.householdId).eq("status", "pending")
      )
      .take(100);
    
    const enriched: RedemptionWithDetails[] = [];
    for (const redemption of redemptions) {
      const reward = await ctx.db.get(redemption.rewardId);
      const child = await ctx.db.get(redemption.childId);
      if (reward && child) {
        enriched.push({
          redemption,
          rewardTitle: reward.title,
          childName: child.name,
        });
      }
    }
    return enriched;
  },
});

export const listForChild = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const redemptions = await ctx.db
      .query("rewardRedemptions")
      .withIndex("by_childId_and_status", q => q.eq("childId", user._id))
      .take(50);
    return redemptions;
  },
});

export const request = mutation({
  args: { rewardId: v.id("rewards") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    
    const reward = await ctx.db.get(args.rewardId);
    if (!reward) throw new Error("Reward not found");
    if (reward.householdId !== user.householdId) throw new Error("Invalid household");
    if (!reward.isActive) throw new Error("Reward is not active");
    if (reward.eligibleChildIds.length > 0 && !reward.eligibleChildIds.includes(user._id)) {
      throw new Error("You are not eligible for this reward");
    }

    const childStats = await ctx.db
      .query("childStats")
      .withIndex("by_childId", q => q.eq("childId", user._id))
      .unique();
    if (!childStats) throw new Error("Child stats not found");

    const availableBalance = childStats.tokenBalance - childStats.tokensReserved;
    if (availableBalance < reward.tokenCost) {
      throw new Error("Insufficient tokens");
    }

    const redemptionId = await ctx.db.insert("rewardRedemptions", {
      householdId: user.householdId,
      rewardId: args.rewardId,
      childId: user._id,
      status: "pending",
      tokenCost: reward.tokenCost,
    });

    await ctx.db.patch(childStats._id, {
      tokensReserved: childStats.tokensReserved + reward.tokenCost,
    });

    const caregivers = await ctx.db
      .query("users")
      .withIndex("by_householdId_and_role", q =>
        q.eq("householdId", user.householdId).eq("role", "caregiver")
      )
      .collect();

    for (const caregiver of caregivers) {
      await ctx.db.insert("notifications", {
        householdId: user.householdId,
        userId: caregiver._id,
        title: "Reward Requested",
        body: `${user.name} wants "${reward.title}" (${reward.tokenCost} tokens)`,
        read: false,
        type: "reward_requested",
        relatedId: redemptionId,
      });
    }

    return redemptionId;
  },
});

export const approve = mutation({
  args: { redemptionId: v.id("rewardRedemptions") },
  handler: async (ctx, args) => {
    const user = await requireCaregiver(ctx);

    const redemption = await ctx.db.get(args.redemptionId);
    if (!redemption) throw new Error("Redemption not found");
    if (redemption.householdId !== user.householdId) throw new Error("Invalid household");
    if (redemption.status !== "pending") throw new Error("Redemption is not pending");

    const childStats = await ctx.db
      .query("childStats")
      .withIndex("by_childId", q => q.eq("childId", redemption.childId))
      .unique();
    if (!childStats) throw new Error("Child stats not found");

    await ctx.db.patch(childStats._id, {
      tokenBalance: childStats.tokenBalance - redemption.tokenCost,
      tokensReserved: childStats.tokensReserved - redemption.tokenCost,
      totalSpent: childStats.totalSpent + redemption.tokenCost,
    });

    await ctx.db.patch(args.redemptionId, {
      status: "approved",
      resolvedAt: Date.now(),
    });

    const reward = await ctx.db.get(redemption.rewardId);
    if (reward) {
      await ctx.db.insert("notifications", {
        householdId: user.householdId,
        userId: redemption.childId,
        title: "Reward Approved!",
        body: `"${reward.title}" was approved!`,
        read: false,
        type: "reward_approved",
        relatedId: redemption._id,
      });
    }

    return null;
  },
});

export const reject = mutation({
  args: { redemptionId: v.id("rewardRedemptions") },
  handler: async (ctx, args) => {
    const user = await requireCaregiver(ctx);

    const redemption = await ctx.db.get(args.redemptionId);
    if (!redemption) throw new Error("Redemption not found");
    if (redemption.householdId !== user.householdId) throw new Error("Invalid household");
    if (redemption.status !== "pending") throw new Error("Redemption is not pending");

    const childStats = await ctx.db
      .query("childStats")
      .withIndex("by_childId", q => q.eq("childId", redemption.childId))
      .unique();
    if (!childStats) throw new Error("Child stats not found");

    await ctx.db.patch(childStats._id, {
      tokensReserved: childStats.tokensReserved - redemption.tokenCost,
    });

    await ctx.db.patch(args.redemptionId, {
      status: "rejected",
      resolvedAt: Date.now(),
    });

    const reward = await ctx.db.get(redemption.rewardId);
    if (reward) {
      await ctx.db.insert("notifications", {
        householdId: user.householdId,
        userId: redemption.childId,
        title: "Reward Not Approved",
        body: `"${reward.title}" request was declined.`,
        read: false,
        type: "reward_rejected",
        relatedId: redemption._id,
      });
    }

    return null;
  },
});