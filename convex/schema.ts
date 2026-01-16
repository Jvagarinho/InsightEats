import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    goal: v.union(v.literal("weight_loss"), v.literal("muscle_gain")),
    currentWeightKg: v.number(),
    heightCm: v.number(),
  }).index("by_clerkUserId", ["clerkUserId"]),
  goals: defineTable({
    userId: v.id("users"),
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
    tdee: v.number(),
    caloriesTarget: v.number(),
    proteinTargetGrams: v.number(),
    carbsTargetGrams: v.number(),
    fatTargetGrams: v.number(),
    createdAt: v.string(),
  }).index("by_user", ["userId"]),
  foods: defineTable({
    name: v.string(),
    caloriesPer100g: v.number(),
    proteinPer100g: v.number(),
    carbsPer100g: v.number(),
    fatPer100g: v.number(),
    fiberPer100g: v.optional(v.number()),
  }).index("by_name", ["name"]),
  logs: defineTable({
    userId: v.id("users"),
    foodId: v.id("foods"),
    quantityGrams: v.number(),
    date: v.string(),
    loggedAt: v.string(),
  }).index("by_user_date", ["userId", "date"]),
  weight_logs: defineTable({
    userId: v.id("users"),
    weight: v.number(),
    date: v.string(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),
});

