import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  households: defineTable({
    name: v.string(),
    createdBy: v.string(),
  }).index("by_createdBy", ["createdBy"]),

  users: defineTable({
    householdId: v.id("households"),
    tokenIdentifier: v.optional(v.string()),
    role: v.union(v.literal("caregiver"), v.literal("child")),
    name: v.string(),
    avatar: v.string(),
    age: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index("by_householdId", ["householdId"])
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_householdId_and_role", ["householdId", "role"]),

  childStats: defineTable({
    childId: v.id("users"),
    currentStreak: v.number(),
    longestStreak: v.number(),
    completionRate: v.number(),
    tokenBalance: v.number(),
    tokensReserved: v.number(),
    totalEarned: v.number(),
    totalSpent: v.number(),
    earnedThisWeek: v.number(),
  }).index("by_childId", ["childId"]),

  chores: defineTable({
    householdId: v.id("households"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    recurrence: v.union(
      v.literal("once"),
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly")
    ),
    isRequired: v.boolean(),
    approvalMode: v.union(v.literal("auto"), v.literal("manual")),
    photoProofRequired: v.boolean(),
    baseTokens: v.number(),
    earlyCompletionBonus: v.boolean(),
    earlyBonusValue: v.number(),
    streakBonus: v.boolean(),
    streakBonusValue: v.number(),
    assignedChildIds: v.array(v.id("users")),
    isActive: v.boolean(),
    dueTime: v.string(),
  })
    .index("by_householdId", ["householdId"])
    .index("by_householdId_and_isActive", ["householdId", "isActive"]),

  choreOccurrences: defineTable({
    householdId: v.id("households"),
    choreId: v.id("chores"),
    childId: v.id("users"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("due"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("pending_approval"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("overdue"),
      v.literal("expired")
    ),
    dueDate: v.number(),
    completedAt: v.optional(v.number()),
    tokensEarned: v.optional(v.number()),
    photoStorageId: v.optional(v.id("_storage")),
  })
    .index("by_childId", ["childId"])
    .index("by_childId_and_status", ["childId", "status"])
    .index("by_householdId_and_status", ["householdId", "status"])
    .index("by_choreId", ["choreId"])
    .index("by_dueDate", ["dueDate"]),

  rewards: defineTable({
    householdId: v.id("households"),
    title: v.string(),
    description: v.string(),
    tokenCost: v.number(),
    category: v.string(),
    isActive: v.boolean(),
    imageEmoji: v.optional(v.string()),
    eligibleChildIds: v.array(v.id("users")),
    stockQuantity: v.optional(v.number()),
  })
    .index("by_householdId", ["householdId"])
    .index("by_householdId_and_isActive", ["householdId", "isActive"]),

  rewardRedemptions: defineTable({
    householdId: v.id("households"),
    rewardId: v.id("rewards"),
    childId: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    tokenCost: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_householdId_and_status", ["householdId", "status"])
    .index("by_childId_and_status", ["childId", "status"])
    .index("by_rewardId", ["rewardId"]),

  notifications: defineTable({
    householdId: v.id("households"),
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    read: v.boolean(),
    type: v.union(
      v.literal("chore_completed"),
      v.literal("chore_approved"),
      v.literal("chore_rejected"),
      v.literal("reward_requested"),
      v.literal("reward_approved"),
      v.literal("reward_rejected"),
      v.literal("reminder")
    ),
    relatedId: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_read", ["userId", "read"])
    .index("by_householdId", ["householdId"]),

  tokenLedger: defineTable({
    householdId: v.id("households"),
    childId: v.id("users"),
    amount: v.number(),
    type: v.union(
      v.literal("chore_earned"),
      v.literal("reward_spent"),
      v.literal("bonus"),
      v.literal("adjustment")
    ),
    relatedId: v.optional(v.string()),
    note: v.optional(v.string()),
  })
    .index("by_childId", ["childId"])
    .index("by_childId_and_type", ["childId", "type"])
    .index("by_householdId", ["householdId"]),
});