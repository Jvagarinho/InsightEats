import { z } from "zod";

export const profileFormSchema = z.object({
  age: z
    .string()
    .min(1, "Age is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 10 && val <= 100, {
      message: "Age must be between 10 and 100",
    }),
  weightKg: z
    .string()
    .min(1, "Weight is required")
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0 && val <= 500, {
      message: "Weight must be between 0.1 and 500 kg",
    }),
  heightCm: z
    .string()
    .min(1, "Height is required")
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0 && val <= 260, {
      message: "Height must be between 1 and 260 cm",
    }),
  sex: z.enum(["male", "female"]),
  activityLevel: z.enum([
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
  ]),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const weightInputSchema = z
  .string()
  .min(1, "Weight is required")
  .transform((val) => parseFloat(val))
  .refine((val) => val > 0 && val <= 500, {
    message: "Weight must be between 0.1 and 500 kg",
  });

export type WeightInputValues = z.infer<typeof weightInputSchema>;

export const foodQuantitySchema = z
  .string()
  .min(1, "Quantity is required")
  .transform((val) => parseFloat(val))
  .refine((val) => val > 0 && val <= 10000, {
    message: "Quantity must be between 0.1 and 10000 grams",
  });

export type FoodQuantityValues = z.infer<typeof foodQuantitySchema>;
