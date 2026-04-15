import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

function parseDueTime(dueTime: string): { hours: number; minutes: number } {
  const [hours, minutes] = dueTime.split(":").map(Number);
  return { hours, minutes };
}

function getStartOfDay(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

function getEndOfDay(): number {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now.getTime();
}

export const generateDailyOccurrences = internalMutation({
  args: {},
  handler: async (ctx) => {
    const households = await ctx.db.query("households").take(100);

    for (const household of households) {
      const hId = household._id;

      const chores = await ctx.db
        .query("chores")
        .withIndex("by_householdId_and_isActive", q => q.eq("householdId", hId).eq("isActive", true))
        .take(200);

      const today = new Date();
      const dayOfWeek = today.getDay();
      const dateOfMonth = today.getDate();

      for (const chore of chores) {
        if (chore.recurrence === "once") continue;

        if (chore.recurrence === "weekly" && dayOfWeek !== 1) continue;
        if (chore.recurrence === "monthly" && dateOfMonth !== 1) continue;

        const { hours, minutes } = parseDueTime(chore.dueTime);
        const dueDate = new Date();
        dueDate.setHours(hours, minutes, 0, 0);

        for (const childId of chore.assignedChildIds) {
          const startOfDay = getStartOfDay();
          const endOfDay = getEndOfDay();

          const existing = await ctx.db
            .query("choreOccurrences")
            .withIndex("by_choreId", q => q.eq("choreId", chore._id))
            .filter(q =>
              q.and(
                q.eq(q.field("childId"), childId),
                q.gte(q.field("dueDate"), startOfDay),
                q.lt(q.field("dueDate"), endOfDay)
              )
            )
            .take(1);

          if (existing.length > 0) continue;

          await ctx.db.insert("choreOccurrences", {
            householdId: chore.householdId,
            choreId: chore._id,
            childId,
            status: "due",
            dueDate: dueDate.getTime(),
          });
        }
      }
    }

    return null;
  },
});

export const markOverdueOccurrences = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const candidates = await ctx.db
      .query("choreOccurrences")
      .withIndex("by_dueDate", q => q.lt("dueDate", now))
      .take(200);
    const overdueOccurrences = candidates.filter(o => o.status === "due");

    for (const occ of overdueOccurrences) {
      await ctx.db.patch(occ._id, { status: "overdue" });
    }

    return { markedCount: overdueOccurrences.length };
  },
});

const crons = cronJobs();

crons.cron(
  "generate daily chore occurrences",
  "0 1 * * *",
  internal.crons.generateDailyOccurrences,
  {}
);

crons.cron(
  "mark overdue occurrences",
  "0 * * * *",
  internal.crons.markOverdueOccurrences,
  {}
);

export default crons;