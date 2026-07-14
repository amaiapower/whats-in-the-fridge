# Build Log

A running log of each change made to this app: what was asked, why, and what it looked like
afterward. Each entry corresponds to a git commit and a screenshot in `build-log/screenshots/`.

## Note on history before this log

This project was built over an extended session before it was a git repository, so the many
intermediate iterations (especially the many rounds of refinement on the retro version) were
never committed anywhere and can't be recovered — each edit overwrote the previous state in
place. Git tracking and this log start now, from the current state of the app.

The three main versions built during that untracked period still exist as separate live routes,
so a snapshot of each was captured as a starting point:

- `build-log/screenshots/current-full-version.png` — the original version (`/`): side-by-side
  layout, cream/terracotta/sage stationery-shop aesthetic.
- `build-log/screenshots/current-simple-version.png` — the simplified version (`/simple`):
  single-focus flow (form → loading → result) with a hand-drawn frying pan loading animation.
- `build-log/screenshots/current-retro-version.png` — the retro version (`/retro`): notepad-style
  ingredient list, dish type/vibe/spice-salt-sweet pickers, allergy preferences, dusty rose/mauve
  palette, torn-tape recipe card.

## 2026-07-07 — Repo initialized, build log started

**Prompt:** Set up git and a screenshot-per-change log going forward, since no history existed
to recover from before this point.

**Reasoning:** Without version control, every past iteration was an irreversible overwrite —
there was no way to go back and see how the retro version looked three rounds of feedback ago.
Starting git tracking now means every future change gets a real commit, a screenshot, and a
short written record of why it happened.

**Screenshots:** see the three files listed above.

## 2026-07-07 — Reduced to a single version (retro), pushed to GitHub

**Prompt:** "i believe i am finished with the project, can we deploy to github?" followed by
"wait, i dont want the three versions accessible, just the most updated version" — the retro
version was chosen as the one to keep, moved to the homepage, and the other two deleted entirely
from the codebase (not just unlinked).

**Reasoning:** With deployment approaching, having three parallel versions live at once (the
original, simple, and retro) no longer made sense — only the most developed one should be
public. The retro version had received by far the most rounds of refinement (dish types, vibes,
spice/salt/sweet levels, allergy preferences, notepad styling, tape details), so it became `/`.
The original and simple versions' pages and any components used exclusively by them were deleted
outright rather than left dangling and unlinked, since the goal was a clean, minimal codebase
with nothing left to accidentally expose. The retro-only color palette and Handlee font, which
had been scoped to a `.retro-theme` class so they could coexist with the other two versions'
styling, were folded directly into the root theme now that there's only one version to serve.

**Screenshots:** `build-log/screenshots/v2-single-retro-homepage.png`

## 2026-07-13 — Fixed recipe generation timing out on Vercel

**Prompt:** "My recipe generation function is timing out on Vercel after 60 seconds... Can you add timing/logging around the Anthropic API call... check whether the code is doing anything else that could be slow... check what model I'm currently calling."

**Reasoning:** Generation was hitting Vercel's 60s function limit. The `/api/generate-recipe` route makes a single Anthropic call, but the web search tool was configured with `max_uses: 5` — each search round is a full search-then-continue-generating cycle happening inside that one request, so a worst-case run could chain 5 rounds before returning. Added timing/usage logging around the API call so slowness is visible in server logs instead of failing silently, then reduced `max_uses` to 3, switched to the current dynamic-filtering `web_search_20260209` tool variant, and set `output_config.effort` to `"medium"` (Sonnet 5 defaults to `"high"`) to cut per-step latency. Separately, the account tied to the API key had run out of credit, which was producing fast, unrelated 400 errors that looked like part of the same problem until isolated — the user rotated to a new key and updated it in Vercel and locally. Verified end-to-end after both fixes: a real generation (with 2 web searches) completed in 35.3s, comfortably under the 60s limit.

**Screenshots:** none — server-side/API-only change, no visual difference from `v2-single-retro-homepage.png`.

## 2026-07-14 — Fixed raw JSON-parse error surfacing to users

**Prompt:** A colleague testing the deployed app hit an error reading `Unexpected token 'A', "An error o"... is not valid JSON` after clicking "New recipe" to redo their ingredient list, which cleared on a page refresh.

**Reasoning:** Two small bugs, both in `handleGenerate`/`handleNewRecipe` in `src/app/page.tsx`. First, `handleNewRecipe` reset the recipe and view but never cleared the `error` state, unlike `handleSelectHistory` which does — so a leftover error from an earlier failed attempt could persist on screen after navigating back to the form. Second, and the more likely cause of what was actually seen: `handleGenerate` called `res.json()` directly without a fallback, so on the rare occasion the server returns a non-JSON response (e.g. a generic platform error page from a Vercel cold-start hiccup instead of the app's own JSON error), the raw `SyntaxError` text leaked straight to the user instead of a readable message. Wrapped the `res.json()` call so a parse failure now surfaces as "Recipe generation failed unexpectedly (status N). Please try again." instead. Verified both fixes locally by mocking a non-JSON 500 response and confirming the friendly message renders.

**Screenshots:** none — bug fix only, no visual change to the working UI.
