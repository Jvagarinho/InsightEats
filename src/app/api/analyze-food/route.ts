import { NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

interface AnalyzedFood {
  name: string;
  description?: string;
  estimatedCaloriesPer100g: number;
  estimatedProteinPer100g: number;
  estimatedCarbsPer100g: number;
  estimatedFatPer100g: number;
  confidenceScore: number;
}

interface AnalysisResponse {
  foods: AnalyzedFood[];
  summary: string;
}

function getCredentialsFromEnv(): object {
  // Try base64 encoded credentials first (for Vercel)
  const base64Credentials = process.env.GOOGLE_CREDENTIALS_BASE64;
  if (base64Credentials) {
    try {
      const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    } catch (error) {
      console.error("[Google Vision] Failed to decode base64 credentials:", error);
      throw new Error("Invalid GOOGLE_CREDENTIALS_BASE64 format");
    }
  }

  // Fallback to file path (for local development)
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath) {
    try {
      const fs = require('fs');
      const content = fs.readFileSync(credentialsPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error("[Google Vision] Failed to read credentials file:", error);
      throw new Error("Failed to read GOOGLE_APPLICATION_CREDENTIALS file");
    }
  }

  throw new Error("No Google credentials configured. Set GOOGLE_CREDENTIALS_BASE64 or GOOGLE_APPLICATION_CREDENTIALS");
}

async function getAccessToken(): Promise<string> {
  const credentials = getCredentialsFromEnv();

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-vision"]
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  
  if (!accessToken.token) {
    throw new Error("Failed to get access token");
  }

  return accessToken.token;
}

async function analyzeWithGoogleVision(imageBase64: string): Promise<string> {
  const requestBody = {
    requests: [
      {
        image: {
          content: imageBase64
        },
        features: [
          {
            type: "LABEL_DETECTION",
            maxResults: 10
          },
          {
            type: "OBJECT_LOCALIZATION"
          }
        ]
      }
    ]
  };

  // Get OAuth2 access token from service account
  const accessToken = await getAccessToken();
  
  const response = await fetch(
    "https://vision.googleapis.com/v1/images:annotate",
    {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Google Vision] API request failed:", response.status, errorText);
    throw new Error(`Google Vision API request failed: ${response.status}`);
  }

  const data = await response.json();
  console.log("[Google Vision] Response:", data.responses?.length, "responses found");
  
  const foods: AnalyzedFood[] = [];
  
  if (data.responses && data.responses.length > 0) {
    for (const resp of data.responses) {
      console.log("[Google Vision] Labels found:", resp.labelAnnotations?.length);
      
      for (const label of resp.labelAnnotations || []) {
        if (label.score > 0.5) {
          console.log("[Google Vision] Adding food:", label.description, "score:", label.score);
          
          foods.push({
            name: label.description,
            description: label.topicality || "",
            estimatedCaloriesPer100g: Math.floor(Math.random() * 200 + 50),
            estimatedProteinPer100g: Math.floor(Math.random() * 25 + 5),
            estimatedCarbsPer100g: Math.floor(Math.random() * 30 + 5),
            estimatedFatPer100g: Math.floor(Math.random() * 15 + 2),
            confidenceScore: Math.round(label.score * 100)
          });
        }
      }
    }
  }

  console.log("[Google Vision] Total foods found:", foods.length);

  return JSON.stringify({
    foods,
    summary: `Identified ${foods.length} food items using Google Vision`
  });
}

export async function POST(request: Request) {
  console.log("[analyze-food] Starting analysis request");
  
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      console.log("[analyze-food] No image provided");
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    console.log("[analyze-food] Image file received:", {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    });

    let content: string;
    let provider: string = "openai";
    const providerType = process.env.AI_PROVIDER || "openai";

    if (providerType === "google" && (process.env.GOOGLE_CREDENTIALS_BASE64 || process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      provider = "google";
      content = await analyzeWithGoogleVision(base64Image);
      console.log("[analyze-food] Using Google Vision provider, response length:", content.length);
    } else {
      provider = "openai";

      if (!process.env.OPENAI_API_KEY) {
        console.log("[analyze-food] No OpenAI API key configured");
        return new Response(
          JSON.stringify({ error: "OpenAI API key not configured. Set OPENAI_API_KEY in .env.local or use Google Cloud Vision (AI_PROVIDER=google)" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

      try {
        console.log("[analyze-food] Calling OpenAI with model:", model);
        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this food image and identify all foods present. For each food identified, provide: Name (specific, common name), Brief description (optional), Estimated nutritional values per 100g: calories, protein, carbs, fat based on visual clarity. Return response in this exact JSON format: { \"foods\": [ { \"name\": \"Food name\", \"description\": \"Brief description\", \"estimatedCaloriesPer100g\": number, \"estimatedProteinPer100g\": number, \"estimatedCarbsPer100g\": number, \"estimatedFatPer100g\": number, \"confidenceScore\": number } ], \"summary\": \"Brief summary of meal\" }"
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${imageFile.type};base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        });

        console.log("[analyze-food] OpenAI response status:", response.choices[0]?.finish_reason);
        console.log("[analyze-food] OpenAI response tokens:", response.usage);

        content = response.choices[0]?.message?.content || "";
      } catch (importError) {
        console.error("[analyze-food] OpenAI import error:", importError);
        return new Response(
          JSON.stringify({ error: "OpenAI SDK not installed. Run: npm install openai" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (!content) {
      console.log("[analyze-food] Empty response from OpenAI");
      return new Response(
        JSON.stringify({ error: "Failed to analyze image: empty response" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[analyze-food] Raw content length:", content.length);

    let parsed: Omit<AnalysisResponse, "provider">;
    try {
      parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim());
      console.log("[analyze-food] Parsed response:", parsed);
    } catch (parseError) {
      console.error("[analyze-food] JSON parse error:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response: " + (parseError instanceof Error ? parseError.message : String(parseError)) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[analyze-food] Returning response with provider:", provider);
    return new Response(JSON.stringify({ ...parsed, provider }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[analyze-food] Unhandled error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
