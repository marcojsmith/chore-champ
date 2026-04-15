import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser, requireCaregiver } from "./lib";

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

export const listForChildById = query({
  args: {
    childId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCaregiver(ctx);
    const limit = args.limit ?? 50;
    const entries = await ctx.db
      .query("tokenLedger")
      .withIndex("by_childId", (q) => q.eq("childId", args.childId))
      .order("desc")
      .take(limit);
    return entries;
  },
});