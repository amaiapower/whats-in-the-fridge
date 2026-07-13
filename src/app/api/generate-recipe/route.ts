import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";
import type { GeneratedRecipe, RecipeRequest } from "@/lib/types";

export const maxDuration = 60;

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in model response");
  }
  return JSON.parse(text.slice(start, end + 1));
}

function parseLevel(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(5, Math.max(0, Math.round(value)))
    : undefined;
}

function isValidRecipe(value: unknown): value is GeneratedRecipe {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.title === "string" &&
    typeof r.description === "string" &&
    typeof r.servings === "number" &&
    Array.isArray(r.ingredients) &&
    Array.isArray(r.steps) &&
    Array.isArray(r.sources)
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "No ANTHROPIC_API_KEY is set. Add your key to .env.local and restart the dev server.",
      },
      { status: 500 }
    );
  }

  let body: RecipeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const ingredients = Array.isArray(body.ingredients)
    ? body.ingredients.filter((i): i is string => typeof i === "string" && i.trim().length > 0)
    : [];
  const vibe = typeof body.vibe === "string" ? body.vibe : "simple";
  const servings = Number.isFinite(body.servings) && body.servings > 0 ? Math.round(body.servings) : 2;
  const dishType = typeof body.dishType === "string" && body.dishType.trim() ? body.dishType : undefined;
  const spiceLevel = parseLevel(body.spiceLevel);
  const saltLevel = parseLevel(body.saltLevel);
  const sweetLevel = parseLevel(body.sweetLevel);
  const avoid = Array.isArray(body.avoid)
    ? body.avoid.filter((a): a is string => typeof a === "string" && a.trim().length > 0)
    : undefined;

  if (ingredients.length === 0) {
    return NextResponse.json(
      { error: "Add at least one ingredient before generating a recipe." },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const apiCallStart = performance.now();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 8000,
      system: buildSystemPrompt(),
      output_config: { effort: "medium" },
      tools: [
        {
          type: "web_search_20260209",
          name: "web_search",
          max_uses: 3,
        },
      ],
      messages: [
        {
          role: "user",
          content: buildUserPrompt({
            ingredients,
            vibe,
            servings,
            dishType,
            spiceLevel,
            saltLevel,
            sweetLevel,
            avoid,
          }),
        },
      ],
    });
    const apiCallMs = performance.now() - apiCallStart;

    const searchResultBlocks = message.content.filter(
      (block) => block.type === "web_search_tool_result"
    ).length;
    console.log(
      `[generate-recipe] Anthropic call: ${apiCallMs.toFixed(0)}ms, ` +
        `stop_reason=${message.stop_reason}, web_searches=${searchResultBlocks}, ` +
        `input_tokens=${message.usage.input_tokens}, output_tokens=${message.usage.output_tokens}`
    );

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const parsed = extractJson(text);

    if (!isValidRecipe(parsed)) {
      return NextResponse.json(
        { error: "The model returned an unexpected response shape. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generate-recipe error", err);
    const messageText = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Recipe generation failed: ${messageText}` },
      { status: 500 }
    );
  }
}
