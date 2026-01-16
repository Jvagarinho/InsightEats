import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

async function totalsForUserAndDate(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  dateStr: string
) {
  const logs = await ctx.db
    .query("logs")
    .withIndex("by_user_date", (q) =>
      q.eq("userId", userId).eq("date", dateStr)
    )
    .collect();

  if (logs.length === 0) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };
  }

  const foodIds = logs.map((l) => l.foodId);
  const foods = await Promise.all(foodIds.map((id) => ctx.db.get(id)));

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const food = foods[i];
    if (!food) continue;

    const factor = log.quantityGrams / 100;
    calories += food.caloriesPer100g * factor;
    protein += food.proteinPer100g * factor;
    carbs += food.carbsPer100g * factor;
    fat += food.fatPer100g * factor;
    fiber += (food.fiberPer100g ?? 0) * factor;
  }

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
  };
}

export const listToday = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    
    if (!user) return [];

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);

    return await ctx.db
      .query("logs")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", dateStr)
      )
      .order("asc")
      .collect();
  },
});

export const summaryToday = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    
    if (!user) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);

    return await totalsForUserAndDate(ctx, user._id, dateStr);
  },
});

export const summaryForDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }

    return await totalsForUserAndDate(ctx, user._id, args.date);
  },
});

export const addToLog = mutation({
  args: {
    foodId: v.id("foods"),
    quantityGrams: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    
    if (!user) throw new Error("User not found");

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);

    const logId = await ctx.db.insert("logs", {
      userId: user._id,
      foodId: args.foodId,
      quantityGrams: args.quantityGrams,
      date: dateStr,
      loggedAt: now.toISOString(),
    });

    return logId;
  },
});
