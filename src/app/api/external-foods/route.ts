import { NextResponse } from "next/server";

const OFF_BASE_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

type ExternalFood = {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g?: number;
  source: "Open Food Facts" | "USDA";
};

async function fetchOpenFoodFacts(term: string): Promise<ExternalFood[]> {
  try {
    const url =
      `${OFF_BASE_URL}?search_terms=${encodeURIComponent(term)}` +
      "&search_simple=1&action=process&json=1&page_size=5" +
      "&fields=product_name,nutriments,id,code";

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const products = Array.isArray(data.products) ? data.products : [];

    return products
      .map((product: Record<string, unknown>) => {
        const nutriments = (product.nutriments as Record<string, unknown>) || {};
        const rawEnergyKcal100 = nutriments["energy-kcal_100g"];
        const rawEnergyKcal = nutriments["energy-kcal"];
        const rawEnergy100 = nutriments["energy_100g"];

        let calories: number | undefined;
        if (typeof rawEnergyKcal100 === "number") {
          calories = rawEnergyKcal100;
        } else if (typeof rawEnergyKcal === "number") {
          calories = rawEnergyKcal;
        } else if (typeof rawEnergy100 === "number") {
          calories = rawEnergy100 / 4.184;
        }

        const protein = nutriments.proteins_100g as number | undefined;
        const carbs = nutriments.carbohydrates_100g as number | undefined;
        const fat = nutriments.fat_100g as number | undefined;

        if (
          !product.product_name ||
          typeof calories !== "number" ||
          typeof protein !== "number" ||
          typeof carbs !== "number" ||
          typeof fat !== "number"
        ) {
          return null;
        }

        return {
          id: `off-${product.id || product.code || product._id}`,
          name: product.product_name,
          caloriesPer100g: calories,
          proteinPer100g: protein,
          carbsPer100g: carbs,
          fatPer100g: fat,
          fiberPer100g: nutriments.fiber_100g,
          source: "Open Food Facts",
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("OFF fetch error:", error);
    return [];
  }
}

async function fetchUSDA(term: string): Promise<ExternalFood[]> {
  const apiKey = process.env.USDA_API_KEY;
  if (!apiKey) return [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const url = `${USDA_BASE_URL}?api_key=${apiKey}&query=${encodeURIComponent(
      term
    )}&pageSize=5`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error("USDA fetch non-OK:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    const foods = Array.isArray(data.foods) ? data.foods : [];

    return foods
      .map((food: Record<string, unknown>) => {
        const nutrients = (food.foodNutrients as Array<Record<string, unknown>>) || [];

        const getNutrient = (ids: number | number[]) => {
          const idArray = Array.isArray(ids) ? ids : [ids];
          return nutrients.find((n) => idArray.includes(n.nutrientId as number))?.value;
        };

        // USDA Nutrient IDs:
        // Energy (kcal): 1008, 2047, 2048 (Atwater General), 2048 (Atwater Specific)
        // Protein: 1003
        // Fat: 1004
        // Carbs: 1005
        // Fiber: 1079

        const calories = getNutrient([1008, 2047, 2048]);
        const protein = getNutrient(1003) ?? 0;
        const fat = getNutrient(1004) ?? 0;
        const carbs = getNutrient(1005) ?? 0;
        const fiber = getNutrient(1079);

        if (!food.description || typeof calories !== "number") {
          return null;
        }

        let name = food.description;
        // Append brand or data type if helpful
        if (food.brandOwner) {
          name = `${name} (${food.brandOwner})`;
        } else if (food.dataType === "Foundation") {
          name = `${name} (Raw/Foundation)`;
        }

        return {
          id: `usda-${food.fdcId}`,
          name: name,
          caloriesPer100g: calories,
          proteinPer100g: protein,
          carbsPer100g: carbs,
          fatPer100g: fat,
          fiberPer100g: fiber,
          source: "USDA",
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term") ?? "";

  if (!term || term.length < 3) {
    return NextResponse.json({ products: [] });
  }

  // Run fetches in parallel
  const [offResults, usdaResults] = await Promise.all([
    fetchOpenFoodFacts(term),
    fetchUSDA(term),
  ]);

  // Combine results
  const combined = [...usdaResults, ...offResults];

  return NextResponse.json({ products: combined });
}
