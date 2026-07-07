type ClassProp = { className?: string };

// Always-visible pan silhouette. No hover state of its own.
export function FryingPan({ className }: ClassProp) {
  return (
    <svg viewBox="0 0 100 60" className={`text-ink-soft/70 ${className ?? ""}`} fill="none" aria-hidden>
      <ellipse cx="46" cy="34" rx="26" ry="9" stroke="currentColor" strokeWidth="2.5" />
      <path d="M20 34 Q46 41 72 34" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path d="M72 34 Q86 31 96 25" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

// Squiggly smoke lines. In "peer-hover" mode this element must be rendered as a
// direct sibling of the `.peer` trigger element (Tailwind's peer-hover uses the
// CSS general-sibling combinator, which does not reach into descendants of a
// sibling — so the visibility toggle has to live on this top-level <svg> itself).
export function PanSmoke({ mode, className }: ClassProp & { mode: "peer-hover" | "always" }) {
  const visibility =
    mode === "always"
      ? ""
      : "opacity-0 peer-hover:opacity-100 peer-active:opacity-100 transition-opacity duration-200";

  return (
    <svg
      viewBox="0 0 100 60"
      className={`text-ink-soft/70 pointer-events-none ${visibility} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path className="animate-[steam-rise_1.6s_ease-in-out_infinite]" d="M38 26 Q34 18 40 12 Q46 7 42 2" />
        <path
          className="animate-[steam-rise_1.6s_ease-in-out_infinite]"
          style={{ animationDelay: "0.4s" }}
          d="M50 26 Q46 16 52 10 Q58 5 54 1"
        />
        <path
          className="animate-[steam-rise_1.6s_ease-in-out_infinite]"
          style={{ animationDelay: "0.8s" }}
          d="M44 28 Q40 20 46 14 Q52 9 48 3"
        />
      </g>
    </svg>
  );
}
