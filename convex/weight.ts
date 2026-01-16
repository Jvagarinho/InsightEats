import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function activityFactor(level: string): number {
  if (level === "sedentary") return 1.2;
  if (level === "light") return 1.375;
  if (level === "moderate") return 1.55;
  if (level === "active") return 1.725;
  if (level === "very_active") return 1.9;
  return 1.2;
}

export const logWeight = mutation({
  args: {
    weight: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);

    // Check if entry exists for today
    const existing = await ctx.db
      .query("weight_logs")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", dateStr)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { weight: args.weight });
    } else {
      await ctx.db.insert("weight_logs", {
        userId: user._id,
        weight: args.weight,
        date: dateStr,
      });
    }

    await ctx.db.patch(user._id, { currentWeightKg: args.weight });

    const goals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (goals) {
      const { age, heightCm, sex, activityLevel } = goals;

      const base =
        10 * args.weight +
        6.25 * heightCm -
        5 * age +
        (sex === "male" ? 5 : -161);

      const tdee = base * activityFactor(activityLevel);

      const caloriesTarget = Math.round(tdee);

      const proteinCalories = caloriesTarget * 0.3;
      const fatCalories = caloriesTarget * 0.25;
      const carbsCalories = caloriesTarget - proteinCalories - fatCalories;

      const proteinTargetGrams = Math.round(proteinCalories / 4);
      const fatTargetGrams = Math.round(fatCalories / 9);
      const carbsTargetGrams = Math.round(carbsCalories / 4);

      const now = new Date().toISOString();

      await ctx.db.patch(goals._id, {
        weightKg: args.weight,
        tdee,
        caloriesTarget,
        proteinTargetGrams,
        carbsTargetGrams,
        fatTargetGrams,
        createdAt: now,
      });
    }
  },
});

export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) return [];

    const history = await ctx.db
      .query("weight_logs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(30);

    return history.reverse();
  },
});
