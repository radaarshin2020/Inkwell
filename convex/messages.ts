import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    // Verify document ownership
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      return [];
    }
    return await ctx.db
      .query("messages")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

export const create = mutation({
  args: {
    documentId: v.id("documents"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    // Verify document ownership
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }
    return await ctx.db.insert("messages", {
      documentId: args.documentId,
      role: args.role,
      content: args.content,
    });
  },
});

export const clear = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    // Verify document ownership
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});

