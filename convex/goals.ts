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

export const calculateAndSaveGoals = mutation({
  args: {
    age: v.number(),
    weightKg: v.number(),
    heightCm: v.number(),
    sex: v.union(v.literal("male"), v.literal("female")),
    activityLevel: v.union(
      v.literal("sedentary"),
      v.literal("light"),
      v.literal("moderate"),
      v.literal("active"),
      v.literal("very_active")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const { age, weightKg, heightCm, sex, activityLevel } = args;

    const base =
      10 * weightKg +
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

    const nowDate = new Date();
    const now = nowDate.toISOString();
    const dateStr = nowDate.toISOString().slice(0, 10);

    const existing = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        age,
        weightKg,
        heightCm,
        sex,
        activityLevel,
        tdee,
        caloriesTarget,
        proteinTargetGrams,
        carbsTargetGrams,
        fatTargetGrams,
        createdAt: now,
      });
    } else {
      await ctx.db.insert("goals", {
        userId: user._id,
        age,
        weightKg,
        heightCm,
        sex,
        activityLevel,
        tdee,
        caloriesTarget,
        proteinTargetGrams,
        carbsTargetGrams,
        fatTargetGrams,
        createdAt: now,
      });
    }

    await ctx.db.patch(user._id, {
      currentWeightKg: weightKg,
      heightCm,
    });

    const existingWeight = await ctx.db
      .query("weight_logs")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", dateStr)
      )
      .unique();

    if (existingWeight) {
      await ctx.db.patch(existingWeight._id, { weight: weightKg });
    } else {
      await ctx.db.insert("weight_logs", {
        userId: user._id,
        weight: weightKg,
        date: dateStr,
      });
    }

    return {
      tdee,
      caloriesTarget,
      proteinTargetGrams,
      carbsTargetGrams,
      fatTargetGrams,
    };
  },
});

export const getGoals = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) return null;

    const goals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(1);

    if (goals.length === 0) return null;

    return goals[0];
  },
});
