# 15 — FIGMA SPECIFICATION

The design file for the marketing site: its structure, variables, components, prototype and
developer annotations — and how it stays in sync with both the code and the product's own file.

---

## 1. Which file, and why a new one

| File | Key | Contains | Owner |
|---|---|---|---|
| **AkechiLMS (Community)** | `VYhP6sBZKcJkjJvtMuvNAQ` | The **product**: foundations, ~28 desktop + ~13 mobile screens, component library, states, accessibility, prototype | Product design |
| **Akechi — Website** | *(to be created, W1.9)* | This site | Marketing design |

A **separate file**, with the product file **linked as a library**. Two reasons:

1. The product file's Color and Scale collections are the source of truth for layer 1. Linking
   rather than copying means a status-colour change propagates instead of drifting — and this
   codebase has already lived through a three-day drift between Figma and `tokens.css` that shipped
   error text at 2.1:1.
2. The marketing layer (display type, section rhythm, ink surfaces, glass) has no business in the
   product file, where it would tempt someone into using a 96px headline in an application screen.

**Do not fork the product file.** Publish it as a library, consume it here.

---

## 2. Page structure

| # | Page | Contents |
|---:|---|---|
| `00` | **Cover** | Thumbnail, version, owner, status, links to `docs/` and the live site |
| `01` | **Foundations** | Layer-2 variables, the display type ramp, ink surfaces, aurora, glass, elevation, the grid, the icon set |
| `02` | **Primitives** | The 14 components of `06` §2, all variants and states |
| `03` | **Layout** | Header, mega-menu, mobile sheet, footer, act wrapper, section rail, sticky CTA |
| `04` | **Homepage · Desktop** | 12 acts at 1440, plus a 1280 variant of anything that reflows |
| `05` | **Homepage · Mobile** | 12 acts at 390, plus 360 checks on the three densest acts |
| `06` | **Page templates** | T1–T5 (`08` §1), each with a real example |
| `07` | **Key pages** | `/pricing`, `/security`, a cluster page, a module page, `/demo`, `/compare/moodle`, `/accessibility` |
| `08` | **Mobile pages** | The same seven at 390 |
| `09` | **Dark mode** | Every act and every key page with the Color collection set to Dark |
| `10` | **States** | Loading, empty, error, success — including **the homepage with all proof slots empty**, which is the launch rendering |
| `11` | **Motion** | Timing diagrams, easing curves, the hero entrance timeline, the reduced-motion rendering side by side |
| `12` | **Accessibility** | Redlined annotations, the contrast matrix, focus order maps, target-size overlays |
| `13` | **Prototype map** | Flows and their starting points |
| `14` | **Handoff** | Developer annotations, spacing overlays, the component→code mapping table |
| `15` | **Archive** | Superseded explorations, dated. Never deleted, never live. |

---

## 3. Variables

Two collections in this file, plus the linked product collections.

### 3.1 Linked from the product library (do not redefine)
`Color` — with its **Light** and **Dark** modes. Every surface, text and status token.
`Scale` — radius and the application type ramp.

### 3.2 `Marketing` collection (this file), modes: **Light** / **Dark**

| Group | Variables |
|---|---|
| `ink/` | `900`, `800`, `700`, `border`, `border-strong` |
| `on-ink/` | `default`, `muted`, `faint` *(named `faint — DECORATIVE ONLY` so nobody types on it)* |
| `glass/` | `bg`, `border`, `blur` |
| `viz/` | `1`–`5` |
| `radius/` | `xl` (24), `2xl` (32), `pill` |

Ink variables hold the **same value in both modes** — ink stays ink in dark mode (`05` §5), and
encoding that in the variable rather than in a designer's memory is what keeps the five-band
rhythm intact when the file is switched to Dark.

### 3.3 `Layout` collection, modes: **Desktop** / **Tablet** / **Mobile**

`space/act`, `space/block`, `gutter`, `container`, `columns`. Switching the mode on a frame
re-lays the whole composition — which is how the responsive pages get built without three
independent designs drifting apart.

---

## 4. Type styles

Text styles, not raw settings, for all eleven tokens in `05` §3.2. Naming mirrors the CSS exactly so
a handoff conversation is unambiguous:

`Display/1` · `Display/2` · `Display/3` · `Title` · `Subtitle` · `Lead` · `Body` · `Body/Small` ·
`Eyebrow` · `Mono` · plus the product's inherited `Heading/*` and `Body/*` for anything rendered
inside a product frame.

**Fraunces must be installed** (Google Fonts) with the `opsz`, `wght`, `SOFT` and `WONK` axes.
Pin `SOFT: 0` and `WONK: 0` on every style — the wonky axis is charming and wrong for an
institutional buyer. `opsz` is set to match the rendered size on each display style; this is the
axis that makes large type look drawn rather than scaled, and forgetting it is the most common way
a Fraunces headline looks slightly off.

If Fraunces is unavailable to a collaborator, the file's fallback is Georgia — visibly different, so
the substitution is obvious rather than silent.

---

## 5. Components

### 5.1 Structure rules
- **Auto Layout everywhere.** A frame without it is a bug.
- Component **properties**, not variant explosion: `Label` (text), `Icon` (instance swap),
  `Show icon` (boolean), plus true variants only for genuinely distinct states.
- Nested instances expose their properties upward, so a `Card` can set its `CTA`'s label without
  detaching.
- Every text layer is bound to a **style**; every fill to a **variable**. A hex literal fails
  review.
- Layers named for what they are (`content`, `media`, `actions`), never `Frame 427`.

### 5.2 The component list

| Group | Components |
|---|---|
| Actions | `CTA` (variant × surface × size = 16), `Link`, `IconButton` |
| Content | `Eyebrow`, `Heading`, `Prose block`, `Stat block`, `Badge`, `Chip`, `Quote` |
| Containers | `Card` (elevation × surface × interactive), `Panel`, `Glass card`, `Divider` |
| Product | `Product frame` (chrome × theme × device), `Capture placeholder`, `Caption` |
| Navigation | `Header`, `Mega-menu`, `Nav item`, `Mobile sheet`, `Footer`, `Breadcrumb`, `Section rail` |
| Interactive | `Tabs` (h/v), `Accordion row`, `Disclosure`, `Field`, `Select`, `Toggle` |
| Proof | `Verifiable item`, `Proof band`, `Testimonial` *(built, unused — §7)*, `Case study card` *(same)* |
| Diagrams | `Spine stop`, `Architecture node`, `Flow arrow` |
| Icons | The Lucide set used on the site, as instance-swappable components |

**Known gotchas, inherited from building the product file** (they cost a day each the first time):

- Setting `layoutMode` on a frame resets sizing modes to AUTO. Set `primaryAxisSizingMode` /
  `counterAxisSizingMode` to `FIXED` **after**, then resize — otherwise circles render as ovals.
- Variable-bound paints render their cached colour on creation unless the resolved value is written
  into the paint. *Changing* a variable's value does live-update bound paints; the caching problem
  is only at creation time.
- Sub-1 opacity is dropped on bound paints when instanced — use dedicated soft tokens, never
  opacity, for tints.
- Inter's style name is `"Semi Bold"`, not `"SemiBold"`.
- Wrapping / FILL text needs `textAutoResize = 'HEIGHT'`.
- There is no `node.padding` shorthand — set each side.
- `counterAxisAlignItems` is `MIN | MAX | CENTER | BASELINE` (there is no `END`).

---

## 6. Prototype

Six flows, each a starting point on page `13`:

1. **The homepage scroll** — Act I → XII, with the role switcher and the module explorer live.
2. **Evaluator path** — Home → `/security` → the permission catalog → `/trust/build-status`.
3. **Owner path** — Home → `/solutions/coaching-institutes` → `/pricing` → `/demo`.
4. **Technical path** — `/compare/moodle` → `/developers` → self-hosting → `/demo`.
5. **Mobile** — the same homepage at 390, including the mobile sheet and the sticky CTA.
6. **Reduced motion** — the homepage rendered with every animation at its end state, so reviewers
   can approve *that* rendering explicitly rather than assuming it.

Interactions use Smart Animate with the real durations and easings from `07` §1. Prototype
destinations must be **Frames**, not Groups — converting them later is an afternoon nobody enjoys.

---

## 7. The empty-proof rendering

Page `10` carries the homepage **with every proof slot empty**, because that is the launch
rendering and it must be signed off as a design in its own right, not inspected as a degraded
state. `Testimonial` and `Case study card` components exist in the library, unused, so that filling
them later is a data change rather than a design project.

The design gate: with the proof slots empty, no vertical gap larger than one `space/block` appears,
and Act XI reads as finished.

---

## 8. Annotations and handoff

Page `14` carries, for every act and key page:

- Spacing overlays using `space/act` and `space/block` labels, never pixel numbers.
- The component→code mapping table: Figma component ↔ `src/components/**` path.
- Breakpoint notes: what reflows, what disappears, what changes order.
- Motion notes referencing `07` by section, not restating durations (one source of truth).
- Accessibility redlines: focus order, target sizes, contrast pairs, `alt` text intent, live
  regions.
- For any product frame: the `captures.json` key, so a developer does not go hunting for the image.

Code Connect is set up for the twelve most-used components once `src/components` exists, so the
Figma MCP returns real component references instead of generated markup.

---

## 9. Sync discipline

| Direction | Trigger | Action |
|---|---|---|
| Figma → code | A layer-2 variable changes | Update `tokens.marketing.css` **in the same day**, and note it in `19` |
| Code → Figma | A `--mk-*` token changes in code | Update the `Marketing` collection in the same PR's review |
| Product → both | A layer-1 token changes in `packages/ui` | The product file is the source; this file inherits via the linked library; **verify the site's contrast matrix still passes** |
| Captures | The product ships a UI change | Re-run `pnpm captures`, update `captures.json`, replace the Figma frames' placeholder images |

**The one rule that has already been broken once in this project:** a token change is not done until
*both* sides carry it. The product's `tokens.css` holds an eleven-line comment about the three days
its status colours disagreed with Figma. Read it before you change a variable.

---

## 10. File hygiene

- No detached instances in a live page. Detaching is allowed only on page `15` (Archive).
- No hidden layers left behind "just in case" — that is what Archive is for.
- Every frame named as its route or act (`Act VI · Lifecycle`, `/pricing · Desktop`).
- Cover page updated with the version and date on every review.
- Components published to the file's library only after they exist in `06`.
- Deleted explorations go to Archive with a date, never to the bin.
