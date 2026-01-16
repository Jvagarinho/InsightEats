import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateForCurrentUser = mutation({
  args: {
    goal: v.optional(
      v.union(v.literal("weight_loss"), v.literal("muscle_gain"))
    ),
    currentWeightKg: v.optional(v.number()),
    heightCm: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkUserId = identity.subject;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();

    if (existing) {
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkUserId,
      goal: args.goal ?? "weight_loss",
      currentWeightKg: args.currentWeightKg ?? 70,
      heightCm: args.heightCm ?? 170,
    });

    return userId;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const clerkUserId = identity.subject;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();
  },
});

