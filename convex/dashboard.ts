import { query } from "./_generated/server";
import { requireCaregiver } from "./lib";
import type { Doc } from "./_generated/dataModel";
import type { Id } from "./_generated/dataModel";

type ChildWithStats = {
  _id: Id<"users">;
  name: string;
  avatar: string;
  age: number | undefined;
  tokenBalance: number;
  currentStreak: number;
  completionRate: number;
};

type DashboardData = {
  metrics: {
    choresDue: number;
    choresCompleted: number;
    overdueChores: number;
    pendingApprovals: number;
    pendingRewardRequests: number;
  };
  children: ChildWithStats[];
  recentActivity: Array<{
    _id: Id<"notifications">;
    title: string;
    body: string;
    read: boolean;
    type: Doc<"notifications">["type"];
    _creationTime: number;
    userId: Id<"users">;
  }>;
  weeklyCompletion: Array<{ label: string; completed: number; total: number }>;
  weeklyTokens: Array<{ label: string; value: number }>;
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getStartOfDay(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

export const getData = query({
  args: {},
  handler: async (ctx): Promise<DashboardData> => {
    const caregiver = await requireCaregiver(ctx);
    const hId = caregiver.householdId;

    const choresDue = await ctx.db
      .query("choreOccurrences")
      .withIndex("by_householdId_and_status", q => q.eq("householdId", hId).eq("status", "due"))
      .take(500);

    const choresApproved = await ctx.db
      .query("choreOccurrences")
      .withIndex("by_householdId_and_status", q => q.eq("householdId", hId).eq("status", "approved"))
      .take(500);

    const startOfDay = getStartOfDay();
    const choresCompletedToday = choresApproved.filter(o => (o.completedAt ?? 0) >= startOfDay).length;

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

    const childUsers = await ctx.db
      .query("users")
      .withIndex("by_householdId_and_role", q => q.eq("householdId", hId).eq("role", "child"))
      .take(50);

    const children: ChildWithStats[] = [];
    for (const child of childUsers) {
      const stats = await ctx.db
        .query("childStats")
        .withIndex("by_childId", q => q.eq("childId", child._id))
        .unique();
      children.push({
        _id: child._id,
        name: child.name,
        avatar: child.avatar,
        age: child.age,
        tokenBalance: stats?.tokenBalance ?? 0,
        currentStreak: stats?.currentStreak ?? 0,
        completionRate: stats?.completionRate ?? 0,
      });
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", q => q.eq("userId", caregiver._id))
      .order("desc")
      .take(5);

    const allOccs = [...choresApproved, ...overdueChores, ...pendingApprovals];
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyCompletion = [];
    for (let i = 6; i >= 0; i--) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() - i);
      const dayStart = dayDate.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const completed = choresApproved.filter(
        o => (o.completedAt ?? 0) >= dayStart && (o.completedAt ?? 0) < dayEnd
      ).length;
      const total = allOccs.filter(o => o.dueDate >= dayStart && o.dueDate < dayEnd).length;
      weeklyCompletion.push({ label: DAY_LABELS[dayDate.getDay()], completed, total });
    }

    const startTime = Date.now() - 28 * 24 * 60 * 60 * 1000;
    const weeklyTokens = [];
    for (let w = 0; w < 4; w++) {
      const weekStart = startTime + w * 7 * 24 * 60 * 60 * 1000;
      const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;
      const tokens = choresApproved
        .filter(o => (o.completedAt ?? 0) >= weekStart && (o.completedAt ?? 0) < weekEnd)
        .reduce((sum, o) => sum + (o.tokensEarned ?? 0), 0);
      weeklyTokens.push({ label: `Wk ${w + 1}`, value: tokens });
    }

    return {
      metrics: {
        choresDue: choresDue.length,
        choresCompleted: choresCompletedToday,
        overdueChores: overdueChores.length,
        pendingApprovals: pendingApprovals.length,
        pendingRewardRequests: pendingRewardRequests.length,
      },
      children,
      recentActivity: notifications.map(n => ({
        _id: n._id,
        title: n.title,
        body: n.body,
        read: n.read,
        type: n.type,
        _creationTime: n._creationTime,
        userId: n.userId,
      })),
      weeklyCompletion,
      weeklyTokens,
    };
  },
});