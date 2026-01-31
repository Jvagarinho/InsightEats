import { Id } from "@/convex/_generated/dataModel";

export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type GoalType = "weight_loss" | "muscle_gain";

export type DateRange = "7" | "30" | "90" | "365";

export type ProfileForm = {
  age: string;
  weightKg: string;
  heightCm: string;
  sex: Sex;
  activityLevel: ActivityLevel;
};

export interface Food {
  _id: Id<"foods">;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g?: number;
}

export interface ExternalFood {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g?: number;
  source?: "Open Food Facts" | "USDA";
}

export interface MacroSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface LogWithFood {
  _id: Id<"logs">;
  userId: Id<"users">;
  foodId: Id<"foods">;
  quantityGrams: number;
  date: string;
  loggedAt: string;
  food: Food | null;
}

export interface WeightLog {
  _id: Id<"weight_logs">;
  userId: Id<"users">;
  weight: number;
  date: string;
}

export interface Goals {
  age: number;
  weightKg: number;
  heightCm: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  tdee: number;
  caloriesTarget: number;
  proteinTargetGrams: number;
  carbsTargetGrams: number;
  fatTargetGrams: number;
}
