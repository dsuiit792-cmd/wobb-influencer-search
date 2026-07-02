# Wobb — Influencer Search (Sujit's Submission)

A production-quality rebuild of the Wobb vibe-coder intern take-home assignment.

---

## Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build — must pass before submitting
npm run lint     # ESLint — zero errors
```

---

## What I Changed

### Task 1 — Bug Fixes

Eight intentional bugs were identified and resolved:

| # | Bug | File | Fix |
|---|-----|------|-----|
| 1 | `react-beautiful-dnd` in `package.json` declares a peer dependency on React `^16 \| ^17 \| ^18`, which npm refuses to install alongside React 19 — `npm install` fails outright | `package.json` | Removed; replaced with `@hello-pangea/dnd`, a maintained React 19–compatible fork with an identical API |
| 2 | Engagement rate rendered as `rate × 10000` → showed e.g. `340%` instead of `3.4%`. The correct `formatEngagementRate(rate × 100)` utility already existed in `formatters.ts` but wasn't used in `ProfileDetailPage` | `ProfileDetailPage.tsx` | Switched to the shared utility |
| 3 | Username filter was case-sensitive (`p.username.includes(query)`) while fullname filter was case-insensitive — searching `"John"` wouldn't find `@john` | `dataHelpers.ts` | Both fields now `toLowerCase()` before comparing |
| 4 | All `<img>` elements were missing `alt` attributes — accessibility failure and a console warning in strict mode | Multiple | Added descriptive `alt` text everywhere |
| 5 | `ProfileCard` had a hardcoded `w-[700px]` class — card overflows and clips on any viewport narrower than 700 px | `ProfileCard.tsx` | Removed; replaced with responsive flex layout |
| 6 | `SearchBar.tsx` was never imported anywhere in the app — dead code | `SearchBar.tsx` | Deleted |
| 7 | `handleProfileClick` in `SearchPage` incremented `clickCount` and logged it, but read the *pre-update* value from the stale closure, so the log always lagged by one click | `SearchPage.tsx` | Removed the useless counter entirely |
| 8 | `setStatus("loading")` was called synchronously inside a `useEffect` body, triggering the `react-hooks/set-state-in-effect` ESLint error | `ProfileDetailPage.tsx` | Status is now initialised directly from the `username` param before the effect runs |

---

### Task 2 — UI / UX Redesign

The original UI was a barebones proof-of-concept. The redesign focused on clarity, accessibility, and mobile-first layout:

**Layout & Navigation**
- Sticky frosted-glass header with the Wobb brand mark and a persistent Shortlist button that shows a live count badge
- `max-w-5xl` centred content container, replacing the fixed `1126px` root that broke on mobile

**Search / Dashboard**
- Platform filter replaced with an accessible **segmented pill control** (`role="tablist"`, `aria-selected`) that looks and behaves like a native tab bar
- Search input has a visible `<label>` (visually hidden via `sr-only`) for screen readers, plus an inline search icon
- Results render as a **responsive 2-column grid** (1-column on mobile) instead of a centred single-column list

**Profile Cards**
- Hover state highlights the card border in the brand violet
- Keyboard navigable: `Enter` and `Space` both trigger navigation (uses `role="button"` + `tabIndex`)
- Avatars are lazy-loaded (`loading="lazy"`) so off-screen images don't block paint
- Fullname and username truncate cleanly with `truncate` on narrow viewports

**Profile Detail**
- Content placed in a white rounded card, stat figures in a tidy grid
- Back-arrow link instead of bare text
- Proper `<h1>` heading hierarchy (was missing before)

**Verified Badge**
- Replaced the plain-text `✓` character with an accessible SVG (`role="img"` + `aria-label="Verified account"`) in brand violet

**Empty States**
- Both the search results list and the shortlist drawer now show an illustrated empty-state message instead of a bare `<p>No profiles found</p>`

---

### Task 3 — Zustand State Management

The starter project did not use React Context for anything meaningful, so there was nothing to "replace" mechanically. However, the shortlist feature (Task 4) needed shared state that survives navigation and page refresh. Rather than reaching for Context, **Zustand** was used from the start — which is exactly the intent of the requirement.

**`src/store/useShortlistStore.ts`** exposes:

| Action | Behaviour |
|--------|-----------|
| `addProfile(profile, platform)` | Appends entry; no-op if `user_id` already present |
| `removeProfile(userId)` | Removes by `user_id` |
| `toggleProfile(profile, platform)` | Adds if absent, removes if present — used by the card button |
| `reorder(startIndex, endIndex)` | Splices the array in place — used after drag-and-drop |
| `isShortlisted(userId)` | Selector returning a boolean — drives button state |
| `clear()` | Empties the entire list |

State is persisted automatically via Zustand's `persist` middleware under the `localStorage` key `wobb-shortlist`.

---

### Task 4 — "Select Profile & Add to List"

**`AddToListButton`** (`src/components/AddToListButton.tsx`)
- Reusable toggle button used in both the card and the detail page
- Reflects state visually (outlined = not added, filled violet = shortlisted) and semantically (`aria-pressed`, descriptive `aria-label`)
- Accepts a `stopPropagation` prop so clicking the button inside a card row doesn't also trigger card navigation

**`ShortlistDrawer`** (`src/components/ShortlistDrawer.tsx`)
- Slide-over panel with a dimmed backdrop, opened from the header button
- Lists all saved profiles with avatar, name, handle, and follower count
- Each entry links through to that profile's detail page
- **Drag-to-reorder** via `@hello-pangea/dnd` (identical API to `react-beautiful-dnd`, but React 19–compatible)
- Remove individual profiles with the × button, or clear all at once
- Persists across page refreshes via the Zustand store

Requirements checklist:
- ✅ Add profiles to the list
- ✅ Prevent duplicate entries (deduped by `user_id`)
- ✅ Display the selected profiles (in the drawer)
- ✅ Allow removing profiles (individual remove + clear all)
- ✅ Persist after page refresh (Zustand `persist` → `localStorage`)

---

### Task 5 — Code Quality

- **Deleted dead code**: `SearchBar.tsx` was never imported
- **Consolidated duplicate logic**: `ProfileCard` and `ProfileDetailPage` each had their own copy of the follower-formatting function. All callers now use `formatFollowers()` from `src/utils/formatters.ts`
- **Proper `aria-*` attributes** throughout (`aria-pressed`, `aria-label`, `aria-live`, `aria-modal`, `role="status"`, `role="dialog"`, `role="tablist"`)
- **Effect cleanup**: the `useEffect` in `ProfileDetailPage` sets a `cancelled` flag on teardown, preventing `setState` calls on unmounted components
- **Typed constants**: `PLATFORM_LABELS` record in `dataHelpers.ts` removes the if/else chain from `getPlatformLabel`
- **Section comments** added to `types/index.ts` and `profileLoader.ts` for clarity

---

### Task 6 — Performance

| Optimisation | Where | Why |
|---|---|---|
| `useMemo` on `extractProfiles` and `filterProfiles` | `SearchPage` | These run array `.map` + `.filter` on every render; memoising means they only re-run when `platform` or `searchQuery` actually changes, not when e.g. the shortlist drawer opens |
| `useCallback` on event handlers | `SearchPage` | Stable references avoid needless re-renders of memoised children |
| `React.memo` on `ProfileCard` | `ProfileCard.tsx` | Prevents re-rendering all cards when a sibling card is shortlisted (the Zustand selector makes each card independent) |
| `loading="lazy"` on avatars | `ProfileCard`, `ShortlistDrawer` | Defers off-screen image fetches until needed |
| Effect cancellation flag | `ProfileDetailPage` | Avoids a `setState` call — and the resulting re-render — after the component unmounts |

---

### Task 7 — Libraries Added

| Library | Reason |
|---------|--------|
| `zustand` | Minimal, boilerplate-free state management with built-in `persist` middleware |
| `@hello-pangea/dnd` | React 19–compatible drag-and-drop for the shortlist drawer (drop-in replacement for the broken `react-beautiful-dnd` that was already in `package.json`) |
| `clsx` | Clean conditional `className` composition |

---

## Assumptions

- Profile data is static JSON — no API or caching layer needed
- `engagement_rate` in the JSON is a decimal fraction (`0.034` = 3.4%), not already a percentage. This is consistent with the existing `formatEngagementRate` utility
- Shortlist is per-browser (localStorage) rather than server-persisted — appropriate for this scope

## Trade-offs

- **No test suite** — Vitest + Testing Library would be the natural next step; `filterProfiles`, `useShortlistStore`, and `AddToListButton` are the highest-priority units to test
- **No loading skeleton** — a shimmer placeholder (`animate-pulse` divs) would improve perceived performance on slow connections
- **No search debounce** — fine for 10 profiles; worth adding (e.g. `useDeferredValue`) before the list grows

## Potential Improvements

- Virtualised list (`@tanstack/virtual`) if profile count grows large
- Debounced / deferred search input
- Skeleton loading states
- Dark mode (straightforward with Tailwind `dark:` classes)
- E2E tests with Playwright

---

## Commit History

```
chore: import Wobb starter project as baseline
fix:   remove react-beautiful-dnd; add zustand, @hello-pangea/dnd, clsx
fix:   resolve 8 bugs in starter codebase
feat:  implement shortlist store with Zustand + localStorage persistence
redesign: modern responsive UI, accessible components, performance optimisations
docs:  final README
```
