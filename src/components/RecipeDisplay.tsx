import type { GeneratedRecipe } from "@/lib/types";

type Props = {
  recipe: GeneratedRecipe;
};

export default function RecipeDisplay({ recipe }: Props) {
  return (
    <div className="rounded-3xl bg-paper border border-line shadow-sm p-6 sm:p-9 relative overflow-hidden">
      <svg
        className="absolute -top-6 -right-6 w-28 h-28 text-sage/20"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <path
          d="M20 60 Q30 20 60 25 Q90 30 75 65 Q60 95 30 80 Q10 70 20 60Z"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>

      <div className="relative">
        <h2 className="font-hand text-4xl sm:text-5xl text-terracotta-dark leading-tight">
          {recipe.title}
        </h2>
        <p className="mt-2 text-ink-soft italic">{recipe.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge label={`Serves ${recipe.servings}`} />
          {recipe.prepTime && <Badge label={`Prep ${recipe.prepTime}`} />}
          {recipe.cookTime && <Badge label={`Cook ${recipe.cookTime}`} />}
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,220px)_1fr]">
          <div>
            <h3 className="font-hand text-2xl text-sage-dark mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 flex-none w-1.5 h-1.5 rounded-full bg-sage" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-hand text-2xl text-sage-dark mb-3">Method</h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-none w-7 h-7 rounded-full bg-terracotta text-paper text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.notes && (
          <div className="mt-8 rounded-2xl bg-sage/10 border border-sage/30 px-5 py-4">
            <p className="text-sm">
              <span className="font-hand text-lg text-sage-dark mr-1">Tip —</span>
              {recipe.notes}
            </p>
          </div>
        )}

        {recipe.sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-dashed border-line">
            <h3 className="text-xs uppercase tracking-wide text-ink-soft mb-2">
              Inspired by
            </h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {recipe.sources.map((source, i) => (
                <li key={i} className="text-sm">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terracotta-dark underline decoration-terracotta/40 underline-offset-2 hover:decoration-terracotta"
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-cream border border-line px-3 py-1 text-xs font-semibold text-ink-soft">
      {label}
    </span>
  );
}
