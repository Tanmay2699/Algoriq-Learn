# 07 — MOTION & INTERACTION

Motion here is a **reading aid**, not decoration. Every animation on this site does one of three
jobs: it directs attention to the next idea, it explains a relationship, or it confirms an action.
Anything that does none of those is deleted — it costs frames, battery and, on a bad connection,
trust.

---

## 1. The motion tokens

```css
/* Duration */
--mk-dur-instant: 80ms;    /* state flips: checkbox, tab underline           */
--mk-dur-fast:   120ms;    /* hover, focus ring, colour                      */
--mk-dur:        200ms;    /* the default: most transitions                  */
--mk-dur-slow:   320ms;    /* entrances, disclosure heights                  */
--mk-dur-scene:  560ms;    /* the hero frame, the spine draw                 */

/* Easing */
--mk-ease:          cubic-bezier(.2, 0, 0, 1);      /* standard: fast out, settle in */
--mk-ease-entrance: cubic-bezier(.16, 1, .3, 1);    /* things arriving               */
--mk-ease-exit:     cubic-bezier(.4, 0, 1, 1);      /* things leaving                */
--mk-ease-spring:   linear(0, .38 12%, .82 26%, 1.02 42%, .99 58%, 1);
                    /* the ONLY overshoot on the site, used only by the sticky CTA   */

/* Distance */
--mk-shift-sm: 8px;
--mk-shift:   14px;    /* reveal translateY                                  */
--mk-shift-lg: 24px;   /* full-bleed media only                              */

/* Stagger */
--mk-stagger:      60ms;
--mk-stagger-tight: 45ms;   /* table rows, chip lists                        */
```

**Two rules on durations.** Nothing under 80ms (invisible, reads as a glitch). Nothing over 600ms
except the two named scene animations — past that, motion stops feeling deliberate and starts
feeling slow, and a visitor who is scrolling has already left.

---

## 2. What may animate

Only **`transform`** and **`opacity`**. Additionally `clip-path` on the two SVG draws, and
`height` on disclosures (where `grid-template-rows: 0fr → 1fr` is used, which is the one honest way
to animate to `auto`).

Never `top`/`left`/`width`/`margin` — layout thrash. Never `filter: blur()` on a scroll-driven
property — it repaints the whole layer every frame and destroys INP on mid-range Android, which is
the device our target learners actually own. `backdrop-filter` appears exactly once (the glass
header) and is `will-change`-free.

---

## 3. The four motion primitives

### 3.1 `<Reveal>`
The workhorse. `IntersectionObserver`, `threshold: 0.15`, `rootMargin: '0px 0px -12% 0px'`, fires
**once** and disconnects.

```
from: opacity 0, translateY(var(--mk-shift))
to:   opacity 1, translateY(0)
dur:  var(--mk-dur-slow)  ease: var(--mk-ease-entrance)
```

**One rule added during the build:** an element that is *already on screen when the page loads*
skips the reveal entirely and renders in its final state. Fading in something the reader has
already started reading is both pointless and a real contrast problem — text mid-transition
measures a ratio nobody ever sees, which is how it was found (axe, at 2.08:1, on a card that was
half-faded when it was sampled).

Constraints: never wraps a heading that is above the fold (it would delay the LCP text node);
never wraps an element whose absence would break layout; the element is **fully server-rendered and
visible in the HTML** — `Reveal` adds a class after mount, so with JS off or before hydration, the
content is simply there. A reveal that starts at `opacity: 0` in CSS and needs JS to un-hide it is
a content-blocking bug wearing an animation's clothes.

### 3.2 `<Stagger>`
Wraps a list; sets `--i` on each child and delays by `calc(var(--i) * var(--mk-stagger))`.
**Capped at 8 children** — beyond that the last item arrives half a second late and the reader has
already scrolled past it. Lists longer than 8 stagger the first 8 and reveal the rest together.

### 3.3 `<Parallax>`
Scroll-linked `translate3d(0, calc(var(--p) * Npx), 0)` where `--p` comes from a single shared
`scroll` listener (passive, rAF-throttled, one listener for the whole page, not one per element).

Limits: **amplitude ≤ 40px**, **≥1024px only**, **fine pointer only**, never on text, never on
anything that could occlude a control. Three uses on the whole site: the aurora blobs (Act I), the
hero frame (Act I), the device cluster (Act VIII). If a fourth is proposed, the answer is no.

### 3.4 `<Counter>`
`requestAnimationFrame` ease-out over 500–800ms scaled to magnitude, once, at 60% visibility.
`tabular-nums` so the width never jitters. The final value is in the SSR HTML.

---

## 4. Scroll choreography

### 4.1 The page-level rhythm
Each act's content reveals as **one group with internal stagger**, not element-by-element as the
reader scrolls through it. A reader scrolling at a normal speed should never see a half-populated
act; a reader scrolling fast should see finished acts, not a trail of animations catching up. That
is what the `-12%` root margin and the once-only observers buy.

### 4.2 Act transitions
The surface change (paper ↔ ink) is the transition. No wipes, no diagonal dividers, no SVG waves.
Where a soft edge is wanted, an ink act gets a 96px gradient bleed into the act above it —
`background-image` only, `aria-hidden`, no motion.

### 4.3 What we refuse
- **Scroll-jacking / pinning.** No `position: sticky` scene that holds the viewport while a
  timeline plays. It breaks the scrollbar's meaning, breaks keyboard `PageDown`, breaks find-in-page,
  breaks the back button's scroll restoration, and on a trackpad it feels broken. Every "Apple-like"
  effect people mean when they ask for this can be achieved with reveals and a drawn line.
- **Scroll-snap on the body.** Same reasons, plus it fights screen readers.
- **Horizontal scroll sections.** A horizontal scroller inside a vertical page is a trap on
  touch and unreachable by keyboard unless carefully built; we have one (the mobile role switcher),
  it is `tabindex`-reachable, and that is the limit.
- **Auto-advancing anything.** SC 2.2.2, and nobody sees slide 3.
- **Cursor followers, magnetic buttons, custom cursors.** They break Fitts's law for the sake of a
  screenshot.

### 4.4 The two scene animations
Both are one-pass, both render complete under reduced motion.

| Scene | Spec |
|---|---|
| **Architecture draw** (Act III) | An SVG line diagram, `stroke-dasharray` → `stroke-dashoffset: 0` over 720ms, `--mk-ease`, staggered 80ms per path, 9 paths. Total 1.4s, once. |
| **Spine draw** (Act VI) | A 2px line drawing left→right over 900ms as the act enters; the seven stop cards reveal on their *own* intersection so a fast scroller is never ahead of the line. |

---

## 5. The hero, in detail

The hero is the only place with a composed entrance. It has a budget: **the LCP text must not be
delayed by a single millisecond of it.**

| t | Event |
|---:|---|
| 0 | HTML paints. Eyebrow, H1, lead, CTAs are **already visible** — no opacity-0 start. |
| 0 | Critical CSS inlined; Inter and Space Grotesk preloaded; H1 is the LCP element. |
| ~120ms | Hydration. The entrance class is added: the *already-visible* elements get a 14px→0 settle with opacity 0.85→1. A reader who never sees this loses nothing. |
| 180ms | Frame fades in and scales 0.985→1 over 560ms. |
| 240ms | Floating KPI card and toast fade in, 60ms apart. |
| 400ms | Aurora drift begins (24s and 31s loops, ≤40px). |
| idle | Captures 2–4 prefetched via `requestIdleCallback`. |

**Why the entrance starts from visible.** The standard hero animation (`opacity: 0` in CSS, revealed
by JS) makes the LCP element depend on JavaScript. On a mid-range Android on 4G that pushes LCP past
3 seconds and the animation is the reason. Ours settles rather than arrives, and the measurement is
identical to a page with no animation at all.

### Role switching
Cross-dissolve, 220ms, `--mk-ease`. Outgoing `opacity 1→0` + `translateY(0→-6px)`; incoming the
mirror. The KPI figure `Counter`s to its new value over 500ms. Under reduced motion: instant swap,
no counter animation, final value.

### Pointer tilt
≤1.2° on two axes, damped at 0.08, `@media (hover: hover) and (pointer: fine) and (min-width: 1280px)`,
disabled under reduced motion. Removed entirely if it costs more than 0.5ms per frame on the
mid-tier device in the perf matrix.

---

## 6. Micro-interactions

| Element | Behaviour |
|---|---|
| **Button hover** | `--brand-600` + `translateY(-1px)`, 120ms. No scale — scaling text makes it blur mid-transition. |
| **Card hover** | `translateY(-2px)` + elevation `e1 → e2`, 200ms. Only on `interactive` cards. |
| **Link hover** | Underline thickens 1px→2px via `text-decoration-thickness`, 120ms. Underlines are always present, never revealed on hover. |
| **Focus** | Instant. Never animated — a focus ring that fades in reads as lag to a keyboard user. |
| **Tab underline** | Slides between tabs, 200ms, `--mk-ease`. Under reduced motion it jumps. |
| **Accordion** | `grid-template-rows: 0fr → 1fr`, 320ms; the chevron rotates 180° in the same beat. |
| **Copy button** | Icon swaps to a check for 1.6s; an `aria-live="polite"` region says "Copied". |
| **Sticky CTA** | Rises on `--mk-ease-spring` (the only overshoot on the site), 380ms. |
| **Header** | **Always solid.** The translucent-over-the-hero treatment was built and then removed: a see-through bar looks good over the hero and then crosses a dark act, where its own dark link text lands on dark content at 3.7:1 — a contrast failure that appears only at certain scroll positions, which is the hardest kind to notice. The sentinel now decides only whether the hairline is drawn (200ms on `border-color`). |
| **Progress bar** | `scaleX` from the scroll ratio, updated in the shared rAF loop. |
| **Theme toggle** | 200ms colour transition on `background` and `color` at the root, with `transition` suppressed for 1 frame on first paint so a hard-refresh does not animate from the wrong theme. |
| **Form error** | Appears instantly (no fade — an error that fades in can be missed); the field's border colour transitions 120ms. No shake: a shake is a motion effect on an element a distressed user is trying to read. |

---

## 7. Reduced motion

`prefers-reduced-motion: reduce` is a **first-class rendering**, designed and reviewed, not a
stripped-down leftover. The product's own `globals.css` already forces near-zero durations
globally; this site adds intent on top of that blanket rule.

| Motion | Reduced-motion rendering |
|---|---|
| Reveals | Content visible, no transform, no opacity change |
| Stagger | All at once |
| Parallax | Static at its mid position |
| Counters | Final value, immediately |
| SVG draws | Complete |
| Hero entrance | Nothing settles; the page is simply correct |
| Role switch / tabs | Instant swap |
| Accordion | Instant open |
| Sticky CTA | Appears without the spring |
| Aurora drift | Static |

**Test:** `motion.spec.ts` loads every page with the emulated preference and asserts (a) no
`animation` or `transition` longer than 20ms is running after load, and (b) the same set of text
nodes is visible as in the animated rendering. The second assertion is the important one — it is
what stops motion from carrying meaning.

---

## 8. Performance rules for motion

1. **One scroll listener** for the whole page (passive, rAF-batched), one `IntersectionObserver`
   per pattern (not per element), both disconnected when their work is done.
2. **No `will-change` left on.** Applied on interaction start, removed on end. A permanent
   `will-change: transform` promotes a layer for the life of the page and costs memory on exactly
   the devices we care about.
3. **Composite-only.** Anything that triggers layout or paint during scroll is a bug. Verified with
   a DevTools performance trace in the W5 gate: no long tasks > 50ms during a full-page scroll on
   the mid-tier device.
4. **Animation JS budget: ≤ 6 KB gzipped** for the whole site. This is why there is no animation
   library (`13` §7).
5. **Battery and thermals.** The aurora loops are `transform`-only and pause via
   `IntersectionObserver` when Act I is out of view. An idle background animation running on a
   section nobody is looking at is a battery bug.

---

## 9. Interaction rules (non-motion)

1. **Everything works from a keyboard, in a logical order, with a visible focus ring.** Tab order
   follows the DOM; nothing uses positive `tabindex`.
2. **Hover is never the only way to reach anything.** Every hover reveal is also a focus reveal and
   is present in the DOM for touch.
3. **Touch targets ≥ 44×44** with ≥ 8px separation (SC 2.5.8).
4. **No hover-dependent copy.** If the explanation matters, it is on the page.
5. **The back button restores scroll position** — Next's default; verified, not assumed.
6. **Find-in-page works.** Nothing important is hidden inside a collapsed accordion that has no
   textual entry point, and the FAQ's `<details>` content is in the DOM.
7. **Deep links work.** Every act has an `id`; `/#security` scrolls to Act IX with
   `scroll-margin-top` accounting for the sticky header.
8. **Nothing steals focus.** No autofocus except the first field of `/demo`, and only when the page
   was reached with an explicit intent parameter.
