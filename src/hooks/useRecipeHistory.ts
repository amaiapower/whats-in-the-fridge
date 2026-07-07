"use client";

import { useCallback, useEffect, useState } from "react";
import type { GeneratedRecipe, RecipeRequest, SavedRecipe } from "@/lib/types";

const STORAGE_KEY = "fridge-recipe-history";
const MAX_HISTORY = 20;

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `recipe-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useRecipeHistory() {
  const [history, setHistory] = useState<SavedRecipe[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    } finally {
      setLoaded(true);
    }
  }, []);

  const persist = useCallback((next: SavedRecipe[]) => {
    setHistory(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage full or unavailable — history just won't persist
    }
  }, []);

  const addRecipe = useCallback(
    (recipe: GeneratedRecipe, request: RecipeRequest) => {
      const saved: SavedRecipe = {
        ...recipe,
        id: makeId(),
        createdAt: new Date().toISOString(),
        request,
      };
      setHistory((current) => {
        const next = [saved, ...current].slice(0, MAX_HISTORY);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // storage full or unavailable — history just won't persist
        }
        return next;
      });
      return saved;
    },
    []
  );

  const removeRecipe = useCallback(
    (id: string) => {
      persist(history.filter((r) => r.id !== id));
    },
    [history, persist]
  );

  const clearHistory = useCallback(() => {
    persist([]);
  }, [persist]);

  return { history, loaded, addRecipe, removeRecipe, clearHistory };
}
