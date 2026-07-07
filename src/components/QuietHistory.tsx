import type { SavedRecipe } from "@/lib/types";

type Props = {
  history: SavedRecipe[];
  onSelect: (recipe: SavedRecipe) => void;
  onRemove: (id: string) => void;
};

export default function QuietHistory({ history, onSelect, onRemove }: Props) {
  if (history.length === 0) return null;

  return (
    <details className="mt-2 text-center">
      <summary className="cursor-pointer text-xs text-ink-soft/70 hover:text-ink-soft transition-colors inline-block">
        Recipe box ({history.length})
      </summary>
      <ul className="mt-3 space-y-1 max-w-sm mx-auto text-left">
        {history.map((recipe) => (
          <li key={recipe.id} className="group flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(recipe)}
              className="flex-1 min-w-0 text-left rounded-lg px-2.5 py-1.5 text-xs text-ink-soft hover:bg-cream hover:text-ink transition-colors cursor-pointer truncate"
            >
              {recipe.title}
            </button>
            <button
              type="button"
              aria-label="Remove from history"
              onClick={() => onRemove(recipe.id)}
              className="flex-none opacity-0 group-hover:opacity-100 focus:opacity-100 text-ink-soft/60 hover:text-terracotta-dark transition-opacity cursor-pointer px-1 text-xs"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
