import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./lib";

export const listForChild = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("tokenLedger")
      .withIndex("by_childId", q => q.eq("childId", user._id))
      .order("desc")
      .take(limit);
  },
});