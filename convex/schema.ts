import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    updatedAt: v.number(),
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
});

