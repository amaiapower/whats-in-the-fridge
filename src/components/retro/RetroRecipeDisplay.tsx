import type { GeneratedRecipe } from "@/lib/types";
import { TORN_TAPE_CLIP, TAPE_TEXTURE } from "./tornEdge";

type Props = {
  recipe: GeneratedRecipe;
};

const TAG_COLORS = [
  "bg-mustard/30 text-mustard-dark",
  "bg-sage/25 text-sage-dark",
  "bg-terracotta/20 text-terracotta-dark",
];

export default function RetroRecipeDisplay({ recipe }: Props) {
  return (
    <div className="relative rounded-[2rem] bg-paper border-2 border-ink/15 shadow-lg p-5 sm:p-7 overflow-visible -rotate-[0.5deg]">
      <div
        className="absolute top-[-10px] left-[-40px] w-20 h-5 bg-sage/60 -rotate-45"
        style={{ clipPath: TORN_TAPE_CLIP, backgroundImage: TAPE_TEXTURE }}
        aria-hidden
      />
      <div
        className="absolute top-[-10px] right-[-40px] w-20 h-5 bg-mustard/60 rotate-45"
        style={{ clipPath: TORN_TAPE_CLIP, backgroundImage: TAPE_TEXTURE }}
        aria-hidden
      />

      <div className="relative">
        <h2 className="font-retro text-4xl sm:text-5xl text-rust leading-tight">{recipe.title}</h2>
        <p className="mt-2 text-ink-soft italic font-body">{recipe.description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <RetroBadge label={`Serves ${recipe.servings}`} />
          {recipe.prepTime && <RetroBadge label={`Prep ${recipe.prepTime}`} />}
          {recipe.cookTime && <RetroBadge label={`Cook ${recipe.cookTime}`} />}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,230px)_1fr]">
          <div className="flex flex-col">
            <h3 className="font-retro text-3xl text-sage-dark mb-2">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-body">
                  <span className="mt-1 flex-none text-mustard-dark font-retro text-lg leading-none">
                    ✦
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {recipe.notes && (
              <div className="mt-5 rounded-2xl bg-mustard/10 border-2 border-mustard/30 px-4 py-3 -rotate-[0.3deg]">
                <p className="text-sm font-body">
                  <span className="font-retro text-xl text-mustard-dark mr-1">Psst…</span>
                  {recipe.notes}
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-retro text-3xl text-sage-dark mb-2">Method</h3>
            <ol className="space-y-3.5">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="flex-none w-8 h-8 rounded-full border-2 border-rust text-rust font-retro text-xl flex items-center justify-center rotate-[-4deg]"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed pt-1.5 font-body">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.sources.length > 0 && (
          <div className="mt-5 pt-4 border-t-2 border-dotted border-ink/15">
            <h3 className="text-xs uppercase tracking-wide text-ink-soft mb-2 font-body">
              Inspired by
            </h3>
            <ul className="flex flex-wrap gap-2">
              {recipe.sources.map((source, i) => (
                <li key={i}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block rounded-md px-3 py-1.5 text-xs font-semibold font-body shadow-sm transition-transform hover:scale-105 ${
                      TAG_COLORS[i % TAG_COLORS.length]
                    }`}
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

function RetroBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-butter border-2 border-ink/10 px-3 py-1 text-xs font-semibold text-ink-soft font-body">
      {label}
    </span>
  );
}
