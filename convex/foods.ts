import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const search = query({
  args: {
    term: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const term = args.term.trim().toLowerCase();
    const limit = args.limit ?? 10;

    if (term.length === 0) {
      return await ctx.db.query("foods").order("asc").take(limit);
    }

    const all = await ctx.db
      .query("foods")
      .withIndex("by_name")
      .order("asc")
      .collect();

    const filtered = all.filter((food) =>
      food.name.toLowerCase().includes(term)
    );

    return filtered.slice(0, limit);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    caloriesPer100g: v.number(),
    proteinPer100g: v.number(),
    carbsPer100g: v.number(),
    fatPer100g: v.number(),
    fiberPer100g: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("foods")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("foods", args);
  },
});

