import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, requireCaregiver } from "./lib";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    return user;
  },
});

export const listChildren = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCaregiver(ctx);
    const children = await ctx.db
      .query("users")
      .withIndex("by_householdId_and_role", q => 
        q.eq("householdId", user.householdId).eq("role", "child")
      )
      .take(50);
    return children;
  },
});

export const createChild = mutation({
  args: { 
    name: v.string(), 
    age: v.number(), 
    avatar: v.string() 
  },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    
    const childId = await ctx.db.insert("users", {
      householdId: caregiver.householdId,
      role: "child",
      name: args.name,
      avatar: args.avatar,
      age: args.age,
      isActive: true,
    });

    await ctx.db.insert("childStats", {
      childId,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      tokenBalance: 0,
      tokensReserved: 0,
      totalEarned: 0,
      totalSpent: 0,
      earnedThisWeek: 0,
    });

    return childId;
  },
});

export const updateChild = mutation({
  args: { 
    childId: v.id("users"), 
    name: v.optional(v.string()), 
    age: v.optional(v.number()), 
    avatar: v.optional(v.string()) 
  },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const child = await ctx.db.get("users", args.childId);
    
    if (!child) throw new Error("Child not found");
    if (child.householdId !== caregiver.householdId) throw new Error("Unauthorized");
    if (child.role !== "child") throw new Error("Not a child");

    const updates: { name?: string; age?: number; avatar?: string } = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.age !== undefined) updates.age = args.age;
    if (args.avatar !== undefined) updates.avatar = args.avatar;

    await ctx.db.patch(args.childId, updates);
    return null;
  },
});

export const getChild = query({
  args: { childId: v.id("users") },
  handler: async (ctx, args) => {
    const caregiver = await requireCaregiver(ctx);
    const child = await ctx.db.get("users", args.childId);
    
    if (!child) return null;
    if (child.householdId !== caregiver.householdId) return null;
    if (child.role !== "child") return null;

    const stats = await ctx.db
      .query("childStats")
      .withIndex("by_childId", q => q.eq("childId", args.childId))
      .unique();

    return { user: child, stats };
  },
});

export const getChildStats = query({
  args: { childId: v.id("users") },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("childStats")
      .withIndex("by_childId", q => q.eq("childId", args.childId))
      .unique();
    return stats ?? null;
  },
});