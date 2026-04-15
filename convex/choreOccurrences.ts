import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireCaregiver, requireUser } from "./lib";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

type ChoreOccurrenceEnriched = Omit<Doc<"choreOccurrences">, "householdId"> & {
  choreTitle: string;
  choreDescription: string;
  baseTokens: number;
  photoProofRequired: boolean;
  approvalMode: "auto" | "manual";
};

async function updateStreak(ctx: MutationCtx, childId: Id<"users">) {
  const approved = await ctx.db
    .query("choreOccurrences")
    .withIndex("by_childId_and_status", q => q.eq("childId", childId).eq("status", "approved"))
    .order("desc")
    .take(500);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const dayStart = today.getTime() - i * 24 * 60 * 60 * 1000;
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const hasCompletion = approved.some(o => (o.completedAt ?? 0) >= dayStart && (o.completedAt ?? 0) < dayEnd);
    if (hasCompletion) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  const stats = await ctx.db
    .query("childStats")
    .withIndex("by_childId", q => q.eq("childId", childId))
    .unique();
  if (stats) {
    await ctx.db.patch(stats._id, {
      currentStreak: streak,
      longestStreak: Math.max(stats.longestStreak, streak),
    });
  }
}

const statusType = v.union(
  v.literal("scheduled"),
  v.literal("due"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("pending_approval"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("overdue"),
  v.literal("expired")
);

function getStartOfDay(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

export const listForCaregiver = query({
  args: { status: v.optional(statusType) },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const hId = caregiver.householdId;

    let queryCtx = ctx.db
      .query("choreOccurrences")
      .withIndex("by_householdId_and_status", q => q.eq("householdId", hId));

    if (args.status) {
      queryCtx = ctx.db
        .query("choreOccurrences")
        .withIndex("by_householdId_and_status", q => q.eq("householdId", hId).eq("status", args.status!));
    }

    const occurrences = await queryCtx.take(200);
    return occurrences;
  },
});

export const listForChild = query({
  args: { status: v.optional(statusType) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (user.role !== "child") throw new Error("Not authorized for child view");

    let queryCtx;
    if (args.status) {
      queryCtx = ctx.db
        .query("choreOccurrences")
        .withIndex("by_childId_and_status", q => q.eq("childId", user._id).eq("status", args.status!));
    } else {
      queryCtx = ctx.db
        .query("choreOccurrences")
        .withIndex("by_childId", q => q.eq("childId", user._id));
    }

    const occurrences = await queryCtx.take(100);
    return occurrences;
  },
});

export const listForChildEnriched = query({
  args: { status: v.optional(statusType) },
  handler: async (ctx, args): Promise<ChoreOccurrenceEnriched[]> => {
    const user = await requireUser(ctx);
    const childId = user._id;

    let queryCtx;
    if (args.status) {
      queryCtx = ctx.db
        .query("choreOccurrences")
        .withIndex("by_childId_and_status", q => q.eq("childId", childId).eq("status", args.status!));
    } else {
      queryCtx = ctx.db
        .query("choreOccurrences")
        .withIndex("by_childId", q => q.eq("childId", childId));
    }

    const occurrences = await queryCtx.take(100);

    const enriched: ChoreOccurrenceEnriched[] = [];
    for (const occ of occurrences) {
      const chore = await ctx.db.get(occ.choreId);
      enriched.push({
        ...occ,
        choreTitle: chore?.title ?? "Unknown",
        choreDescription: chore?.description ?? "",
        baseTokens: chore?.baseTokens ?? 0,
        photoProofRequired: chore?.photoProofRequired ?? false,
        approvalMode: chore?.approvalMode ?? "manual",
      });
    }

    return enriched;
  },
});

export const approve = mutation({
  args: { occurrenceId: v.id("choreOccurrences"), tokensToAward: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const hId = caregiver.householdId;

    const occurrence = await ctx.db.get("choreOccurrences", args.occurrenceId);
    if (!occurrence) throw new Error("Occurrence not found");
    if (occurrence.householdId !== hId) throw new Error("Unauthorized");

    if (occurrence.status !== "pending_approval") {
      throw new Error("Can only approve pending occurrences");
    }

    const chore = await ctx.db.get("chores", occurrence.choreId);
    if (!chore) throw new Error("Chore not found");

    const tokensToAward = args.tokensToAward ?? chore.baseTokens;

    await ctx.db.patch(args.occurrenceId, {
      status: "approved",
      tokensEarned: tokensToAward,
    });

    const stats = await ctx.db
      .query("childStats")
      .withIndex("by_childId", q => q.eq("childId", occurrence.childId))
      .unique();
    if (stats) {
      await ctx.db.patch(stats._id, {
        tokenBalance: stats.tokenBalance + tokensToAward,
        totalEarned: stats.totalEarned + tokensToAward,
      });
    }

    await ctx.db.insert("notifications", {
      householdId: hId,
      userId: occurrence.childId,
      type: "chore_approved",
      title: "Chore Approved!",
      body: `Your "${chore.title}" was approved! +${tokensToAward} tokens`,
      read: false,
    });

    await updateStreak(ctx, occurrence.childId);

    return null;
  },
});

export const reject = mutation({
  args: { occurrenceId: v.id("choreOccurrences") },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const hId = caregiver.householdId;

    const occurrence = await ctx.db.get("choreOccurrences", args.occurrenceId);
    if (!occurrence) throw new Error("Occurrence not found");
    if (occurrence.householdId !== hId) throw new Error("Unauthorized");

    if (occurrence.status !== "pending_approval") {
      throw new Error("Can only reject pending occurrences");
    }

    const chore = await ctx.db.get("chores", occurrence.choreId);
    if (!chore) throw new Error("Chore not found");

    await ctx.db.patch(args.occurrenceId, {
      status: "rejected",
    });

    await ctx.db.insert("notifications", {
      householdId: hId,
      userId: occurrence.childId,
      type: "chore_rejected",
      title: "Chore Not Approved",
      body: `Your "${chore.title}" needs to be redone.`,
      read: false,
    });

    return null;
  },
});

export const submit = mutation({
  args: { occurrenceId: v.id("choreOccurrences"), photoStorageId: v.optional(v.id("_storage")) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const occurrence = await ctx.db.get("choreOccurrences", args.occurrenceId);

    if (!occurrence) throw new Error("Occurrence not found");
    if (occurrence.childId !== user._id) throw new Error("Unauthorized");

    if (occurrence.status !== "due" && occurrence.status !== "in_progress" && occurrence.status !== "overdue") {
      throw new Error("Cannot submit in current status");
    }

    const chore = await ctx.db.get("chores", occurrence.choreId);
    if (!chore) throw new Error("Chore not found");

    const completedAt = Date.now();

    if (chore.approvalMode === "auto") {
      await ctx.db.patch(args.occurrenceId, {
        status: "approved",
        completedAt,
        tokensEarned: chore.baseTokens,
        photoStorageId: args.photoStorageId,
      });

      const stats = await ctx.db
        .query("childStats")
        .withIndex("by_childId", q => q.eq("childId", occurrence.childId))
        .unique();
      if (stats) {
        await ctx.db.patch(stats._id, {
          tokenBalance: stats.tokenBalance + chore.baseTokens,
          totalEarned: stats.totalEarned + chore.baseTokens,
          earnedThisWeek: stats.earnedThisWeek + chore.baseTokens,
        });
      }

      const caregivers = await ctx.db
        .query("users")
        .withIndex("by_householdId_and_role", q => q.eq("householdId", occurrence.householdId).eq("role", "caregiver"))
        .take(10);
      for (const caregiverUser of caregivers) {
        await ctx.db.insert("notifications", {
          householdId: occurrence.householdId,
          userId: caregiverUser._id,
          type: "chore_completed",
          title: "Chore Completed",
          body: `${user.name} completed "${chore.title}" and earned ${chore.baseTokens} tokens`,
          read: false,
        });
      }

      await updateStreak(ctx, occurrence.childId);
    } else {
      await ctx.db.patch(args.occurrenceId, {
        status: "pending_approval",
        completedAt,
        photoStorageId: args.photoStorageId,
      });

      const caregivers = await ctx.db
        .query("users")
        .withIndex("by_householdId_and_role", q => q.eq("householdId", occurrence.householdId).eq("role", "caregiver"))
        .take(10);
      for (const caregiverUser of caregivers) {
        await ctx.db.insert("notifications", {
          householdId: occurrence.householdId,
          userId: caregiverUser._id,
          type: "chore_completed",
          title: "Chore Pending Approval",
          body: `${user.name} submitted "${chore.title}" for approval`,
          read: false,
        });
      }
    }

    return null;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = internalMutation({
  args: {
    householdId: v.id("households"),
    choreId: v.id("chores"),
    childId: v.id("users"),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    const occurrenceId = await ctx.db.insert("choreOccurrences", {
      householdId: args.householdId,
      choreId: args.choreId,
      childId: args.childId,
      status: "scheduled",
      dueDate: args.dueDate,
    });

    return occurrenceId;
  },
});

export const getDashboardMetrics = query({
  args: {},
  handler: async (ctx) => {
    const caregiver = await requireCaregiver(ctx);
    const hId = caregiver.householdId;

    const choresDue = await ctx.db
      .query("choreOccurrences")
      .withIndex("by_householdId_and_status", q => q.eq("householdId", hId).eq("status", "due"))
      .take(500);

    const choresCompleted = await ctx.db
      .query("choreOccurrences")
      .withIndex("by_householdId_and_status", q => q.eq("householdId", hId).eq("status", "approved"))
      .take(500);

    const startOfDay = getStartOfDay();
    const completedTodayCount = choresCompleted.filter(o => (o.completedAt ?? 0) >= startOfDay).length;

    const overdueChores = await ctx.db
      .query("choreOccurrences")
      .withIndex("by_householdId_and_status", q => q.eq("householdId", hId).eq("status", "overdue"))
      .take(500);

    const pendingApprovals = await ctx.db
      .query("choreOccurrences")
      .withIndex("by_householdId_and_status", q => q.eq("householdId", hId).eq("status", "pending_approval"))
      .take(500);

    const pendingRewardRequests = await ctx.db
      .query("rewardRedemptions")
      .withIndex("by_householdId_and_status", q => q.eq("householdId", hId).eq("status", "pending"))
      .take(500);

    return {
      choresDue: choresDue.length,
      choresCompleted: completedTodayCount,
      overdueChores: overdueChores.length,
      pendingApprovals: pendingApprovals.length,
      pendingRewardRequests: pendingRewardRequests.length,
    };
  },
});

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type WeeklyCompletion = { label: string; completed: number; total: number };
type WeeklyTokens = { label: string; value: number };
type StatusBreakdown = { label: string; value: number };
type TopChore = { name: string; count: number };

export const getReportsData = query({
  args: { childId: v.optional(v.id("users")), days: v.optional(v.number()) },
  handler: async (ctx, args): Promise<{
    weeklyCompletion: WeeklyCompletion[];
    weeklyTokens: WeeklyTokens[];
    statusBreakdown: StatusBreakdown[];
    topChores: TopChore[];
  }> => {
    const caregiver = await requireCaregiver(ctx);
    const hId = caregiver.householdId;
    const days = args.days ?? 30;
    const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const targetChildId = args.childId;

    const statuses = ["approved", "pending_approval", "rejected", "overdue"] as const;
    const allOccurrences: Doc<"choreOccurrences">[] = [];

    for (const status of statuses) {
      const occs = await ctx.db
        .query("choreOccurrences")
        .withIndex("by_householdId_and_status", q => q.eq("householdId", hId).eq("status", status))
        .take(500);
      allOccurrences.push(...occs);
    }

    const filteredOccurrences = targetChildId
      ? allOccurrences.filter(o => o.childId === targetChildId)
      : allOccurrences;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyCompletion: WeeklyCompletion[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() - i);
      const dayStart = dayDate.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const completed = filteredOccurrences.filter(
        o => (o.completedAt ?? 0) >= dayStart && (o.completedAt ?? 0) < dayEnd && o.status === "approved"
      ).length;
      const total = filteredOccurrences.filter(
        o => o.dueDate >= dayStart && o.dueDate < dayEnd
      ).length;

      weeklyCompletion.push({
        label: DAY_LABELS[dayDate.getDay()],
        completed,
        total,
      });
    }

    const weeklyTokens: WeeklyTokens[] = [];
    const approvedOccs = filteredOccurrences.filter(o => o.status === "approved" && (o.tokensEarned ?? 0) > 0);
    for (let w = 0; w < 4; w++) {
      const weekEnd = startTime + (w + 1) * 7 * 24 * 60 * 60 * 1000;
      const weekStart = startTime + w * 7 * 24 * 60 * 60 * 1000;
      const tokens = approvedOccs
        .filter(o => (o.completedAt ?? 0) >= weekStart && (o.completedAt ?? 0) < weekEnd)
        .reduce((sum, o) => sum + (o.tokensEarned ?? 0), 0);
      weeklyTokens.push({ label: `Wk ${w + 1}`, value: tokens });
    }

    const statusCounts: Record<string, number> = {
      approved: 0,
      pending_approval: 0,
      rejected: 0,
      overdue: 0,
    };
    for (const occ of filteredOccurrences) {
      if (statusCounts[occ.status] !== undefined) {
        statusCounts[occ.status]++;
      }
    }

    const statusLabels: Record<string, string> = {
      approved: "Approved",
      pending_approval: "Pending",
      rejected: "Rejected",
      overdue: "Overdue",
    };
    const statusBreakdown: StatusBreakdown[] = Object.entries(statusCounts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        label: statusLabels[status] ?? status,
        value: count,
      }));

    const choreCounts: Record<string, number> = {};
    const choreTitles: Record<string, string> = {};
    for (const occ of filteredOccurrences) {
      if (occ.status === "approved") {
        choreCounts[occ.choreId] = (choreCounts[occ.choreId] ?? 0) + 1;
      }
      if (!choreTitles[occ.choreId]) {
        const choreDoc = await ctx.db.get("chores", occ.choreId);
        if (choreDoc) {
          choreTitles[occ.choreId] = choreDoc.title;
        }
      }
    }

    const sortedChores = Object.entries(choreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topChores: TopChore[] = sortedChores.map(([choreId, count]) => ({
      name: choreTitles[choreId] ?? "Unknown",
      count,
    }));

    return { weeklyCompletion, weeklyTokens, statusBreakdown, topChores };
  },
});

export const getPhotoUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    return await ctx.storage.getUrl(args.storageId);
  },
});