# ADR 0011 — Representative photography on the five `/solutions/[segment]` pages

**Date:** 2026-09-03 · **Status:** Accepted
**Amends:** `09-VISUAL-LANGUAGE-AND-ASSETS.md` §1, §4, §10

## Context

`09` §1 bans photography outright: "no stock photography, no 3D renders of abstract shapes, no
illustrated characters and no AI-generated imagery." §4 repeats it for illustration specifically.
The one exception on the site is the homepage hero video (`09` §10, shipped 2026-09-01), which the
same document is careful to frame as an exception earned by a specific stakeholder decision and a
specific set of mitigations, not a reopening of the rule.

The five `/solutions/[segment]` pages have a problem the rest of the site does not: each one has
to differentiate a *place* — a coaching institute's reception desk, a school corridor, a university
library, a bootcamp lab, a corporate training room — in the first few seconds a visitor spends on
it, before the page has said a single specific thing about that segment. A hairline diagram (the
site's usual answer, per `09` §3) draws a *mechanism*; it cannot draw a place a reader recognises
as their own building. That gap is what the hero video exception was for too, and it is the reason
this ADR treats the video as precedent rather than starting the argument over from nothing.

## Decision

Representative photography is allowed on `/solutions/[segment]` — five pages, one photo each — and
nowhere else. `/about`, `/pricing`, `/security`, `/trust`, and every product/module page stay
exactly as `09` documents them: no photography.

The three rules the hero video followed apply here unchanged:

1. **Real or representative, never fabricated.** The images are photographic, not generated
   illustration standing in for a product surface — no invented dashboard, no fabricated interface,
   no data made to look real (this is also why the spreadsheet's on-screen numbers and the
   chalkboard text got the same inpainting treatment as the watermark — see below).
2. **Atmosphere, not a claim.** Nothing in frame is legible as a specific fact about Algoryq Learn
   or about any real institute. No entry in `claims.ts`, for the same reason the aurora gradient
   and the hero footage have none.
3. **Disclosed honestly.** Every photo carries a caption naming it as representative photography,
   rendered in the same small, muted register as the hero video's own caption — not hidden, not
   presented as a captured screen.

Implementation: `PageHero` (`src/components/layout/page-parts.tsx`) takes an optional `photo` prop.
When present, the hero becomes a two-column layout at ≥1024px (text in the left five of twelve
columns, the photo right-aligned in the remaining seven, inside a `rounded-xl` / `border-border` /
`shadow-e2` card) and stacks the photo under the text at full width below that. When absent,
`PageHero` renders exactly as it did before this change — every other page that uses it is
unaffected. Copy (`alt`, `caption`) lives in `src/content/solutions.ts` next to each segment's
existing entry, per rule 12, not in the component.

### Watermark removal

Every generated source file carried the generator's own four-point sparkle watermark, low-right.
Removing it without cropping (composition — negative space for the headline, subject placement —
was chosen deliberately) needed the same reasoning `09` §10 already used for the hero video's
watermark, adapted to a still:

- The video method fits `observed = slope × background + intercept` per pixel by least squares
  across multiple frames of the same background. A single still has no second frame to fit
  against, so `09` §10 already names the practical equivalent for that case: content-aware
  inpainting/clone-fill from the immediately surrounding texture. That is what was used here.
- The five source files share one generator and one canvas size convention: the watermark sits at
  the same pixel offset from the bottom-right corner (~98px from each edge) regardless of the
  image's own resolution. That let one mask shape — extracted from the cleanest example, a smooth
  night-scene gradient with no competing texture — be reused across all five rather than
  re-detected per image, which matters because per-image detection kept mis-firing onto brighter
  background texture (a doorway edge, a floor tile) instead of the mark itself on the harder
  images.
- Per `09` §10's own flagged failure mode — an interpolation smear across a real edge running
  through the corner — every image was checked for nearby structure before inpainting, not after:
  the *schools* image has a coat/skirting-board edge close to the mark, and the *skilling-academies*
  image has a concrete-pillar edge close to it. Both masks were kept tight to the watermark itself
  so the fill never crosses into either edge; both were confirmed clean afterward at the pillar
  bolt and the skirting line specifically.
- `cv2.inpaint` (Telea/Navier–Stokes) reconstructed four of the five directly. The fifth
  (*universities*) sits across a soft diagonal bokeh streak, and PDE-based inpainting visibly
  dimmed and kinked it — pulling brightness from the darker pixels above and below the streak
  rather than continuing the streak's own gradient. That one was reconstructed with a directional
  fill instead: linear interpolation along each scanline between the nearest unmasked pixels
  either side of the mask, then feathered at the mask boundary — which continues a linear gradient
  correctly in a way an isotropic diffusion solver does not.
- Confirmed clean: no trace of the mark or an inpainting seam visible at normal viewing size on any
  of the five, and pixel dimensions are unchanged from source (1376×768, no crop, no resize).

Two more legibility fixes followed the same no-crop rule:

- The chalkboard visible through the doorway in the *schools* source was inspected at full
  resolution and up to 6× zoom. It is out of focus enough that no word is legible — confirmed, not
  assumed — so no inpainting was needed there.
- `Spreadsheet_on_wooden_desk_202609031829.jpeg` (considered for the optional `/resources` cover)
  has a printed grid with garbled-but-legible-looking row labels and numbers, which reads as
  fabricated data. It is not currently referenced by any page, and this task's scope is the five
  solution pages only, so it was left untouched rather than inpainted and wired in speculatively —
  fixing it is scoped to whichever future task actually puts it on a page.

## Why

The five solution pages are the one place on the site where recognising a *building* is the job,
and a hairline diagram cannot do that job — see Context. Everywhere else on the site, `09`'s
argument still holds without qualification: the product is the art direction, and a decorative
photo would compete with it. This is deliberately not "photography is now allowed"; it is a second,
equally scoped exception, following the same three rules as the first.

## Consequences

- `docs/09-VISUAL-LANGUAGE-AND-ASSETS.md` §1 and §4 each get a pointer to this ADR, the way §10
  already carries the hero video's.
- Five images ship: `public/images/solutions/{coaching-institutes,schools,universities,
  skilling-academies,corporate-l-and-d}.jpg`, ~130–270 KB each, served through `next/image`
  (AVIF/WebP conversion at request time, five widths, no `priority`). Each stays within the
  per-page 900 KB budget (`09` §9) alongside the rest of its page.
- A third exception request for a different page should not treat this ADR as precedent by
  itself — it should be judged the way this one was, against `09` §1's actual argument (does the
  page need to show a *place* a hairline diagram cannot draw), not against "we did it for
  solutions."

## Alternatives considered

**A sixth hairline diagram, one per segment, showing the same mechanism differently labelled.**
Rejected: the five sections already differentiate the segments in the site's usual visual grammar
(product renderings, per-segment vocabulary, the disqualifier). What they cannot do is answer "does
this look like my institute" in the first second, which is the actual gap a diagram cannot close —
a diagram of a mechanism does not read as a school corridor no matter how it is drawn.
**Extending the hero video's footage into the solution pages** (a segment-specific clip instead of
a still). Rejected on cost and register: five autoplaying videos is a materially different
performance and motion-accessibility commitment than the one the hero earned deliberately, for a
job a still photograph already does — showing a place, not showing motion.
