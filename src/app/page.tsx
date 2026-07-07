"use client";

import { useState } from "react";
import Link from "next/link";
import IngredientInput from "@/components/IngredientInput";
import VibeSelector from "@/components/VibeSelector";
import ServingsInput from "@/components/ServingsInput";
import RecipeDisplay from "@/components/RecipeDisplay";
import RecipeHistory from "@/components/RecipeHistory";
import { useRecipeHistory } from "@/hooks/useRecipeHistory";
import type { GeneratedRecipe, Ingredient, SavedRecipe } from "@/lib/types";
import { VIBES } from "@/lib/types";

export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [vibe, setVibe] = useState(VIBES[0].id);
  const [servings, setServings] = useState(2);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { history, addRecipe, removeRecipe } = useRecipeHistory();

  const includedNames = ingredients.filter((i) => i.included).map((i) => i.name);

  async function handleGenerate() {
    if (includedNames.length === 0) {
      setError("Add (and tick) at least one ingredient first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: includedNames, vibe, servings }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong generating your recipe.");
      }
      const generated = data as GeneratedRecipe;
      setRecipe(generated);
      const saved = addRecipe(generated, { ingredients: includedNames, vibe, servings });
      setActiveId(saved.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectHistory(saved: SavedRecipe) {
    setRecipe(saved);
    setActiveId(saved.id);
    setError(null);
  }

  function handleRemoveHistory(id: string) {
    removeRecipe(id);
    if (id === activeId) {
      setActiveId(undefined);
    }
  }

  return (
    <div className="flex-1 px-4 py-10 sm:px-8 sm:py-14">
      <div className="fixed top-4 right-4 flex flex-col items-end gap-1 text-xs text-ink-soft/50">
        <Link href="/simple" className="hover:text-ink-soft transition-colors">
          simplified version ›
        </Link>
        <Link href="/retro" className="hover:text-ink-soft transition-colors">
          retro version ›
        </Link>
      </div>
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="font-hand text-6xl sm:text-7xl text-terracotta-dark leading-none">
            What&rsquo;s in the fridge?
          </h1>
          <svg
            className="mx-auto mt-2 w-40 h-3 text-sage"
            viewBox="0 0 160 12"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 8 Q30 2 55 7 T110 6 T158 4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="mt-3 text-ink-soft max-w-md mx-auto">
            List what you&rsquo;ve got, pick a vibe, and we&rsquo;ll dream up an original recipe
            just for you.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,400px)_1fr] items-start">
          <div className="space-y-6">
            <IngredientInput ingredients={ingredients} onChange={setIngredients} />
            <VibeSelector value={vibe} onChange={setVibe} />
            <ServingsInput value={servings} onChange={setServings} />

            <div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full rounded-2xl bg-terracotta py-3.5 text-lg font-bold text-paper shadow-sm hover:bg-terracotta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Whisking up ideas…" : "Generate recipe"}
              </button>
              {error && (
                <p className="mt-2 text-sm text-terracotta-dark text-center">{error}</p>
              )}
            </div>

            <RecipeHistory
              history={history}
              activeId={activeId}
              onSelect={handleSelectHistory}
              onRemove={handleRemoveHistory}
            />
          </div>

          <div>
            {recipe ? (
              <RecipeDisplay recipe={recipe} />
            ) : (
              <EmptyState loading={loading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-line p-14 text-center">
      <p className="font-hand text-3xl text-ink-soft mb-2">
        {loading ? "Rummaging through the fridge…" : "Your recipe will appear here"}
      </p>
      <p className="text-sm text-ink-soft/80">
        {loading
          ? "Searching for inspiration and writing something original."
          : "Add your ingredients, pick a vibe, and tap generate."}
      </p>
    </div>
  );
}
