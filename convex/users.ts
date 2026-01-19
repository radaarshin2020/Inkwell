import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return {
      id: user._id,
      name: user.name ?? "",
      email: user.email ?? "",
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Update the user profile
    await ctx.db.patch(userId, {
      name: args.name,
      email: args.email,
    });

    // Also update the auth account's providerAccountId (email) for password provider
    const authAccounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    for (const account of authAccounts) {
      if (account.provider === "password") {
        await ctx.db.patch(account._id, {
          providerAccountId: args.email,
        });
      }
    }
  },
});
