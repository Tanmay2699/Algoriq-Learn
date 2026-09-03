# ADR 0012 — Representative photography, extended past `/solutions` to every page with a defensible fit

**Date:** 2026-09-03 · **Status:** Accepted
**Amends:** [ADR 0011](0011-solutions-segment-photography.md) — the "third exception should be judged on
its own, not on precedent" guidance is superseded by the decision below, which is precisely that
judgement, made once, site-wide, rather than page by page.

## Context

ADR 0011 scoped representative photography to the five `/solutions/[segment]` pages, on the
argument that those five specifically needed to show a *place* a hairline diagram cannot draw, and
closed by saying a third page should earn its own photo the same way, not cite the first five as a
blanket opening.

The requirement changed after that ADR shipped: every page on the site should carry photography
where a genuine fit exists, not only the five solution pages. That is a real reversal of `09` §1's
"no stock photography, anywhere" thesis — worth being honest about rather than reframing as a small
extension. The mitigating fact is that the mechanism, and the honesty rules around it, do not
change: `PageHero`'s `photo` prop, the three-rule contract (real/representative, atmosphere not a
claim, disclosed honestly), and the no-crop/no-fabrication asset pipeline from ADR 0011 all carry
over unchanged. What changes is *how many pages* get judged as having a fit, not what "a fit" means
or how a photo is produced.

**The hard constraint that shaped the result:** there is no image-generation tool available in this
build environment. Every photo on the site is one of the 32 stills generated before this task
started (24 after the five solutions pages and three off-brief images were already accounted for).
Fourteen more of those had a defensible match to a specific page; the rest did not, either because
they are near-duplicate takes of a scene already used elsewhere on the site, or because no unused
still depicts anything relevant to the page in question. "Defensible fit" was applied page by page,
not "did a file happen to be left over" — see the rejected case below.

## Decision

Photography extends to **14 more pages**, each judged individually against the same bar ADR 0011
used ("does a real-world activity connect to what this page is actually about, in a way a diagram
or a stat cannot"), using the fourteen leftover stills that passed that bar:

| Page | Photo | Why it fits |
|---|---|---|
| `/security` | Server rack in a utility room | Infrastructure/hosting — and the product's own self-hosting story (§00 "boots from one compose file") makes this more than decoration |
| `/accessibility` | Wheelchair ramp at a building entrance | The most literal fit on the list |
| `/trust` | Brass keys on an old ledger | Access/audit, abstract enough to carry no specific claim |
| `/product` | Two people reviewing an architecture diagram | The page is a structural overview of the whole platform |
| `/developers` | Two people working through code at a laptop | Open, brick-walled coworking space — reads as engineering, not staged |
| `/integrations` | Two people reviewing a whiteboard diagram beside a laptop | Same space, a different beat — reviewing how systems connect |
| `/product/modules/admissions-crm` | A student reading an enquiry notice board, staff at the reception desk | "Every enquiry, on one board" — literally the photo's subject |
| `/product/modules/assessments` | Empty exam desks, one holding an answer sheet and pencil | Direct |
| `/product/modules/live-classes-and-attendance` | Staff comparing a printed timetable | Direct |
| `/product/modules/placement-and-interviews` | Two people working through an exercise at a shared desk | Practice/collaboration, adjacent to interview prep |
| `/product/modules/courses-and-curriculum` | A student working at a university library table | Coursework, structured reading |
| `/product/modules/assignments-and-grading` | A student writing in a notebook | Direct |
| `/product/modules/staff-and-hr` | A facilitator leading a small-group session | Training/development, the HR-adjacent beat |
| `/product/modules/fees-and-finance` | A ledger-style spreadsheet on a desk (retouched — see below) | Direct, and it is the same "financial paperwork" atmosphere the module's own copy uses |

**One page was deliberately excluded despite having a candidate file: `/customers`.** That page's
own copy says, in the H1, "We have none yet" — it is rule 3 (proof slots render nothing when
empty) in its purest form. A photo of a corporate training session sitting above that sentence
would visually assert the customer activity the text is explicitly disclaiming; that is a
fabrication by image even with an honest caption, which no caption fixes. The candidate file
(`Facilitator_presenting_in_corporate…`) was processed and then deleted rather than shipped
anywhere else with a forced fit. This is the concrete instance of ADR 0011's "judge each page on
its own" instruction, applied for real: a page with a leftover file and a plausible route-name
match was still turned down because its own copy contradicted the image.

`/demo` was also not touched — it does not use `PageHero` (it is a two-column form layout), and it
is the site's one lead-capture page; restructuring it to fit a photo carried more risk than the
fourteen pages above were worth trading against.

**Everything else stays as `09` documents it — text and diagrams only.** That is most of the site:
`/pricing`, `/about`, `/contact`, `/why-algoryq-learn`, `/customers`, `/demo`, every `/legal/*`
page, every `/compare/*` page, `/resources` and its six articles, `/developers/webhooks`,
`/trust/build-status`, `/trust/dpa`, `/trust/responsible-disclosure`, `/trust/sub-processors`, six
of the seven `/product/[cluster]` pages, and six of the fourteen `/product/modules/[slug]` pages
(`institute-website`, `media-and-content`, `ai-assistance`, `learning-delivery`,
`batches-and-enrollment`, `certificates`). No unused still exists that fits any of them, and there
is no tool in this environment to generate one. This is a materials constraint, stated plainly
rather than papered over with a mismatched photo.

### The `fees-and-finance` image needed a second fix beyond watermark removal

Its source, a spreadsheet printout, had garbled-but-legible-looking row labels and numbers — the
exact failure `09` §2.1 already names for a different surface ("no plausible-looking invented
curves, not even to show a chart's shape"). The same reasoning applies to a photographed page of
numbers: styled to read as real data, it reads as fabricated data. Fixed with a feathered,
polygon-masked blur restricted to the printed page's own bright pixels (traced by hand from the
image, not a rectangle — an axis-aligned box left a visible seam crossing the laptop and desk in
the first pass) — strong enough that no character resolves, gentle enough that the ruled grid
still reads as a grid. This is a blur, not `09` §10's inpainting — there is no real content to
reconstruct under fabricated text, so smoothing it below legibility is the substantive fix, and
inpainting would have just produced differently-fabricated digits.

### Watermark removal used one template, three anchor points

All 24 candidate stills share a generator and a fixed-pixel watermark size (a 48×48px mark), but
**the corner offset is a constant number of pixels per output resolution, not a percentage of it**
— assuming the offset scaled with canvas size (the first attempt) placed the mask over empty
background on the 1024×1024 and 2752×1536 stills and left the real mark untouched. Re-verified per
resolution against clean, isolated backgrounds (the same detection method ADR 0011 used) before
re-running: `(1254, 646)` at 1376×768, `(898, 898)` at 1024×1024, `(2615, 1399)` at 2752×1536, each
confirmed against three independent source images before being trusted. `cv2.inpaint` (Telea)
reconstructed all fourteen cleanly at these corrected anchors — none needed `universities.jpg`'s
directional scanline treatment from ADR 0011, because none of the fourteen crosses a real
directional gradient the way that streak did.

## Why

1. **The instruction was explicit and reconsidered on its own merits, not just followed.** The
   scope question (which pages, using which of a finite set of stills) was put back to the person
   who gave the instruction before any of the fourteen were wired in, specifically because the
   honest answer — "not literally every page, some don't have a photo available" — needed to be
   said plainly rather than discovered later as a silent gap.
2. **`/customers` proves the bar is real, not decorative.** A rule that never says no to a
   plausible-looking file is not actually a rule.
3. **The mechanism didn't change, so the risk didn't compound.** Same component, same three
   conditions, same no-crop/no-fabrication pipeline as ADR 0011 — fourteen more applications of an
   already-reviewed pattern, not fourteen new judgment calls about layout or accessibility.

## Consequences

- `docs/09-VISUAL-LANGUAGE-AND-ASSETS.md` §1 and §4 point to this ADR alongside 0011.
- Fourteen more files ship under `public/images/pages/`, 155–277 KB each (2752×1536 `product.jpg`
  is heavier before optimisation but resolves through `next/image` the same as the rest). Total
  page weight for every affected route was measured after this change and stays under the 900 KB
  budget, with `/security` the closest at ~860 KB.
- **Forty-two of the sixty-one interior pages still carry no photography** (61 excludes the
  homepage, which carries the hero video rather than a still, and non-content routes like
  `/sitemap.xml`), some because no candidate image exists for
  their subject and none can be generated in this environment, one (`/customers`) by deliberate
  choice despite having a candidate, and one (`/demo`) for structural/risk reasons. If more source
  photography becomes available, each of those should be judged the way `/customers` was — on
  whether the specific page's own claims survive sitting next to it — not added automatically
  because a file exists.
- Ten source stills remain unused, untouched, and still carry their generator watermark: nine
  near-duplicate takes of scenes the site now already shows elsewhere (more reception-desk,
  timetable, library, ramp and corporate-training shots), plus the `/customers` candidate itself
  (`Facilitator_presenting_in_corporate…`) — a watermark-removed copy of it existed briefly as
  `customers.jpg` and was deleted once that page was ruled out; the original in `public/images/`
  was never touched. Left in place rather than deleted outright, since they are unreferenced but
  not off-brief the way the three deleted images were.

## Alternatives considered

**Force a fit for every remaining page using the near-duplicate stills anyway.** Rejected: a second
"student writing in a notebook" photo on, say, `/contact` is not a different fact about that page,
it is the same photo's content read twice, which is closer to wallpaper than to the "atmosphere for
a place" argument this whole exception rests on.
**Leave the customers.jpg file in place, captioned honestly, and let the caption do the disclosure
work.** Rejected — the risk was never that the image would claim something as fact, since it was
never going to carry a false caption. It was that the *combination* of image and headline reads as
contradicting each other at a glance, before anyone reads the caption at all; a correct caption
does not fix a visual argument the page's own headline is actively making the opposite of.
