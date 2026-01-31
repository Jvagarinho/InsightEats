import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalyzedFood {
  name: string;
  description?: string;
  estimatedCaloriesPer100g: number;
  estimatedProteinPer100g: number;
  estimatedCarbsPer100g: number;
  estimatedFatPer100g: number;
  confidence: number;
}

interface AnalysisResponse {
  foods: AnalyzedFood[];
  summary: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and identify the foods present. For each food identified, provide: Name (specific, common name), Brief description (optional), Estimated nutritional values per 100g: calories, protein, carbs, fat, Confidence level (high/medium/low) based on visual clarity. Return the response in this exact JSON format: { \"foods\": [ { \"name\": \"Food name\", \"description\": \"Brief description\", \"estimatedCaloriesPer100g\": number, \"estimatedProteinPer100g\": number, \"estimatedCarbsPer100g\": number, \"estimatedFatPer100g\": number, \"confidence\": \"high\" or \"medium\" or \"low\" } ], \"summary\": \"Brief summary of the meal\" }"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${file.type};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Failed to analyze image" },
        { status: 500 }
      );
    }

    let parsed: AnalysisResponse;
    try {
      parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim());
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Food analysis error:", error);
    return NextResponse.json(
      { 
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
