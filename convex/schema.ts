import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  // User settings for global AI instructions
  userSettings: defineTable({
    userId: v.id("users"),
    aiSystemInstructions: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  
  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    updatedAt: v.number(),
    aiSystemInstructions: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  knowledge: defineTable({
    documentId: v.id("documents"),
    title: v.string(),
    content: v.string(),
  }).index("by_document", ["documentId"]),

  messages: defineTable({
    documentId: v.id("documents"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  }).index("by_document", ["documentId"]),

  subscriptions: defineTable({
    userId: v.optional(v.id("users")),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("none")
    ),
    email: v.string(),
    currentPeriodEnd: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_email", ["email"])
    .index("by_polar_subscription", ["polarSubscriptionId"]),
});

