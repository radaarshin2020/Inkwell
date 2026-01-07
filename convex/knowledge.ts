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
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

export const create = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.string(),
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
    return await ctx.db.insert("knowledge", {
      documentId: args.documentId,
      title: args.title,
      content: args.content,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("knowledge"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const knowledge = await ctx.db.get(args.id);
    if (!knowledge) {
      throw new Error("Knowledge item not found");
    }
    // Verify document ownership
    const document = await ctx.db.get(knowledge.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Not authorized");
    }
    const updates: { title?: string; content?: string } = {};
    if (args.title !== undefined) {
      updates.title = args.title;
    }
    if (args.content !== undefined) {
      updates.content = args.content;
    }
    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("knowledge") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const knowledge = await ctx.db.get(args.id);
    if (!knowledge) {
      throw new Error("Knowledge item not found");
    }
    // Verify document ownership
    const document = await ctx.db.get(knowledge.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Not authorized");
    }
    await ctx.db.delete(args.id);
  },
});

