import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSubscriptionStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // First try to find by userId
    let subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    // If not found by userId, try to find by user's email
    if (!subscription) {
      const user = await ctx.db.get(userId);
      if (user?.email) {
        const email = user.email;
        subscription = await ctx.db
          .query("subscriptions")
          .withIndex("by_email", (q) => q.eq("email", email))
          .first();
      }
    }

    if (!subscription) {
      return { status: "none" as const, hasActiveSubscription: false };
    }

    return {
      status: subscription.status,
      hasActiveSubscription: subscription.status === "active",
      currentPeriodEnd: subscription.currentPeriodEnd,
      needsLinking: !subscription.userId,
    };
  },
});

export const checkSubscriptionByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!subscription) {
      return { hasActiveSubscription: false };
    }

    return {
      hasActiveSubscription: subscription.status === "active",
      status: subscription.status,
    };
  },
});

export const createOrUpdateSubscription = internalMutation({
  args: {
    email: v.string(),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("none")
    ),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // First, try to find an existing subscription by email
    const existingByEmail = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    // Also try to find by polar subscription ID if provided
    let existingByPolarId = null;
    if (args.polarSubscriptionId) {
      existingByPolarId = await ctx.db
        .query("subscriptions")
        .withIndex("by_polar_subscription", (q) => 
          q.eq("polarSubscriptionId", args.polarSubscriptionId)
        )
        .first();
    }

    const existing = existingByPolarId || existingByEmail;

    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, {
        status: args.status,
        polarCustomerId: args.polarCustomerId ?? existing.polarCustomerId,
        polarSubscriptionId: args.polarSubscriptionId ?? existing.polarSubscriptionId,
        currentPeriodEnd: args.currentPeriodEnd ?? existing.currentPeriodEnd,
      });
      return existing._id;
    }

    // Try to find the user by email to link the subscription
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    // Create new subscription (with or without user link)
    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: user?._id,
      email: args.email,
      polarCustomerId: args.polarCustomerId,
      polarSubscriptionId: args.polarSubscriptionId,
      status: args.status,
      currentPeriodEnd: args.currentPeriodEnd,
    });

    console.log(`Created subscription for ${args.email}, linked to user: ${user?._id ?? 'none'}`);

    return subscriptionId;
  },
});

// Internal mutation to link a subscription to a user after they sign up
export const linkSubscriptionToUser = internalMutation({
  args: {
    email: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (subscription && !subscription.userId) {
      await ctx.db.patch(subscription._id, {
        userId: args.userId,
      });
    }
  },
});

// Mutation to link subscription to current user (called from frontend)
export const linkSubscriptionToCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { linked: false, reason: "not authenticated" };
    }

    const user = await ctx.db.get(userId);
    if (!user?.email) {
      return { linked: false, reason: "no email" };
    }

    const email = user.email;
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!subscription) {
      return { linked: false, reason: "no subscription found" };
    }

    if (subscription.userId) {
      return { linked: true, reason: "already linked" };
    }

    await ctx.db.patch(subscription._id, { userId });
    return { linked: true, reason: "linked now" };
  },
});

// Debug: Create subscription for current user (for testing when webhooks aren't working)
export const debugCreateSubscription = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { success: false, error: "not authenticated" };
    }

    const user = await ctx.db.get(userId);
    if (!user?.email) {
      return { success: false, error: "no email on user" };
    }

    const email = user.email;
    // Check if subscription already exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      // Update to active
      await ctx.db.patch(existing._id, { 
        status: "active",
        userId: userId,
      });
      return { success: true, action: "updated existing subscription to active" };
    }

    // Create new subscription
    await ctx.db.insert("subscriptions", {
      userId: userId,
      email: user.email,
      status: "active",
      polarCustomerId: "debug_customer",
      polarSubscriptionId: "debug_subscription",
    });

    return { success: true, action: "created new subscription" };
  },
});

// Debug: List all subscriptions (for troubleshooting)
export const debugListSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const subscriptions = await ctx.db.query("subscriptions").collect();
    return subscriptions;
  },
});
