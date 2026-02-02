import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Sample foods for demo mode
const sampleFoods = [
  { name: "Chicken Breast", caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, fiberPer100g: 0 },
  { name: "Brown Rice", caloriesPer100g: 112, proteinPer100g: 2.6, carbsPer100g: 23, fatPer100g: 0.9, fiberPer100g: 1.8 },
  { name: "Broccoli", caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4, fiberPer100g: 2.6 },
  { name: "Salmon", caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, fiberPer100g: 0 },
  { name: "Greek Yogurt", caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 0.4, fiberPer100g: 0 },
  { name: "Oatmeal", caloriesPer100g: 68, proteinPer100g: 2.4, carbsPer100g: 12, fatPer100g: 1.4, fiberPer100g: 1.7 },
  { name: "Banana", caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3, fiberPer100g: 2.6 },
  { name: "Almonds", caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50, fiberPer100g: 12.5 },
  { name: "Eggs", caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, fiberPer100g: 0 },
  { name: "Spinach", caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, fiberPer100g: 2.2 },
  { name: "Avocado", caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15, fiberPer100g: 7 },
  { name: "Quinoa", caloriesPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21, fatPer100g: 1.9, fiberPer100g: 2.8 },
  { name: "Blueberries", caloriesPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14, fatPer100g: 0.3, fiberPer100g: 2.4 },
  { name: "Sweet Potato", caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1, fiberPer100g: 3 },
  { name: "Turkey Breast", caloriesPer100g: 135, proteinPer100g: 30, carbsPer100g: 0, fatPer100g: 1, fiberPer100g: 0 },
];

// Sample weight history (last 30 days)
function generateWeightHistory(userId: Id<"users">) {
  const weights = [];
  const baseWeight = 75;
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Gradual weight loss trend with some variation
    const trend = i * 0.05; // Losing about 0.05kg per day
    const randomVariation = (Math.random() - 0.5) * 0.5;
    const weight = baseWeight - trend + randomVariation;
    
    weights.push({
      userId,
      weight: Math.round(weight * 10) / 10,
      date: date.toISOString().slice(0, 10),
    });
  }
  
  return weights;
}

// Generate sample daily logs
function generateDailyLogs(userId: Id<"users">, foodIds: Id<"foods">[]) {
  const logs = [];
  const today = new Date();
  
  // Sample meals for the last 7 days
  const mealPatterns = [
    // Day 1
    [
      { foodIndex: 6, quantity: 120 }, // Banana
      { foodIndex: 5, quantity: 200 }, // Oatmeal
    ],
    // Day 2
    [
      { foodIndex: 0, quantity: 150 }, // Chicken Breast
      { foodIndex: 1, quantity: 180 }, // Brown Rice
      { foodIndex: 2, quantity: 100 }, // Broccoli
    ],
    // Day 3
    [
      { foodIndex: 8, quantity: 100 }, // Eggs
      { foodIndex: 10, quantity: 80 }, // Avocado
    ],
    // Day 4
    [
      { foodIndex: 3, quantity: 120 }, // Salmon
      { foodIndex: 11, quantity: 150 }, // Quinoa
      { foodIndex: 9, quantity: 80 }, // Spinach
    ],
    // Day 5
    [
      { foodIndex: 4, quantity: 200 }, // Greek Yogurt
      { foodIndex: 12, quantity: 100 }, // Blueberries
    ],
    // Day 6
    [
      { foodIndex: 14, quantity: 150 }, // Turkey Breast
      { foodIndex: 13, quantity: 200 }, // Sweet Potato
      { foodIndex: 2, quantity: 120 }, // Broccoli
    ],
    // Day 7 (today)
    [
      { foodIndex: 0, quantity: 140 }, // Chicken Breast
      { foodIndex: 1, quantity: 160 }, // Brown Rice
      { foodIndex: 10, quantity: 60 }, // Avocado
      { foodIndex: 7, quantity: 20 }, // Almonds
    ],
  ];
  
  for (let day = 6; day >= 0; day--) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    const dateStr = date.toISOString().slice(0, 10);
    
    const meals = mealPatterns[6 - day];
    
    for (const meal of meals) {
      const now = new Date();
      now.setDate(now.getDate() - day);
      now.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));
      
      logs.push({
        userId,
        foodId: foodIds[meal.foodIndex],
        quantityGrams: meal.quantity,
        date: dateStr,
        loggedAt: now.toISOString(),
      });
    }
  }
  
  return logs;
}

export const generateDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("[Demo] Starting demo data generation...");
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.error("[Demo] No authenticated user found");
      throw new Error("Not authenticated");
    }
    
    console.log("[Demo] User authenticated:", identity.subject);

    // Get or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    
    console.log("[Demo] Existing user:", user ? "found" : "not found");

    let userId: Id<"users">;
    
    if (!user) {
      // Create demo user profile
      userId = await ctx.db.insert("users", {
        clerkUserId: identity.subject,
        goal: "weight_loss",
        currentWeightKg: 73.5,
        heightCm: 175,
      });
      // Fetch the newly created user
      const newUser = await ctx.db.get(userId);
      if (!newUser) throw new Error("Failed to create user");
      user = newUser as typeof user & {};
    } else {
      // Clear existing demo data
      if (!user) throw new Error("User not found");
      const existingFoods = await ctx.db.query("foods").collect();
      const existingLogs = await ctx.db
        .query("logs")
        .withIndex("by_user_date", (q) => q.eq("userId", user!._id))
        .collect();
      const existingWeightLogs = await ctx.db
        .query("weight_logs")
        .withIndex("by_user", (q) => q.eq("userId", user!._id))
        .collect();

      for (const food of existingFoods) {
        await ctx.db.delete(food._id);
      }
      for (const log of existingLogs) {
        await ctx.db.delete(log._id);
      }
      for (const weightLog of existingWeightLogs) {
        await ctx.db.delete(weightLog._id);
      }
    }

    // Insert sample foods
    const foodIds: Id<"foods">[] = [];
    for (const food of sampleFoods) {
      const id = await ctx.db.insert("foods", food);
      foodIds.push(id);
    }

    // Generate weight history
    const weightHistory = generateWeightHistory(user._id);
    for (const weight of weightHistory) {
      await ctx.db.insert("weight_logs", weight);
    }

    // Generate daily logs
    const dailyLogs = generateDailyLogs(user._id, foodIds);
    for (const log of dailyLogs) {
      await ctx.db.insert("logs", log);
    }

    // Create goals
    const existingGoals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    
    if (!existingGoals) {
      await ctx.db.insert("goals", {
        userId: user._id,
        age: 30,
        weightKg: 73.5,
        heightCm: 175,
        sex: "male",
        activityLevel: "moderate",
        tdee: 2400,
        caloriesTarget: 1900,
        proteinTargetGrams: 150,
        carbsTargetGrams: 200,
        fatTargetGrams: 65,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      foodsAdded: sampleFoods.length,
      weightLogsAdded: weightHistory.length,
      dailyLogsAdded: dailyLogs.length,
    };
  },
});

export const clearDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) {
      return { success: false, message: "No user found" };
    }

    // Clear all logs
    const existingLogs = await ctx.db
      .query("logs")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .collect();
    for (const log of existingLogs) {
      await ctx.db.delete(log._id);
    }

    // Clear weight logs
    const existingWeightLogs = await ctx.db
      .query("weight_logs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const weightLog of existingWeightLogs) {
      await ctx.db.delete(weightLog._id);
    }

    // Clear goals
    const existingGoals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (existingGoals) {
      await ctx.db.delete(existingGoals._id);
    }

    return {
      success: true,
      logsRemoved: existingLogs.length,
      weightLogsRemoved: existingWeightLogs.length,
    };
  },
});

// Query to check if user has demo data
export const checkDemoStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { hasDemoData: false };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) {
      return { hasDemoData: false };
    }

    // Check if user has any data
    const logs = await ctx.db
      .query("logs")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .collect();
    
    const weightLogs = await ctx.db
      .query("weight_logs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const allFoods = await ctx.db.query("foods").collect();

    const hasDemoData = logs.length > 0 || weightLogs.length > 0;

    return {
      hasDemoData,
      logCount: logs.length,
      weightLogCount: weightLogs.length,
      foodCount: allFoods.length,
    };
  },
});
