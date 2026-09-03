Run this in Claude Code, from the root of the `Algoryq-Learn` repo.

---

I generated a batch of candid photos for the site and they're sitting unsorted in `public/images/` (root level), named by generation timestamp instead of by page. I need you to look at each one, match it to the right page, and wire it in properly.

**Step 1 — Inventory and view.** List every file directly under `public/images/` (not inside `images/pages/` or `images/solutions/` — those are already-wired, leave them alone unless a step below says otherwise). For each new file, actually open/view the image — don't rely on the filename alone, they're auto-generated and approximate.

**Step 2 — Dedupe.** These filename pairs look like exact duplicates (same file saved twice, one with a `(1)` suffix):
- `Person_checking_phone_on_commute_202609032254.jpeg` / `Person_checking_phone_on_commute_202609032254 (1).jpeg`
- `Team_collaborating_in_office_202609032254.jpeg` / `Team_collaborating_in_office_202609032254 (1).jpeg`

Confirm they're byte-identical (checksum) and delete the `(1)` copy of each.

**Step 3 — Match each image to exactly one target below.** These are the 27 pages that need a photo. Use the subject description as the primary signal, not the raw filename:

| Page | Subject |
|---|---|
| `/about` | People working together in a small office/team setting |
| `/contact` | Reception desk / someone on a call |
| `/why-algoryq-learn` | Someone overwhelmed juggling multiple disconnected tools/screens |
| `/developers/webhooks` | Someone at a terminal/monitor, code visible |
| `/resources` (index) | General learning/reading scene |
| `/resources/migrating-from-spreadsheets` | Office desk with paper spreadsheets |
| `/resources/rbac-for-schools` | School admin at a computer |
| `/resources/assessment-integrity-without-a-camera` | An exam hall |
| `/resources/buying-accessible-software` | Assistive tech in use, or an accessible entrance |
| `/resources/self-hosting-algoryq-learn` | Server room / technical infrastructure |
| `/resources/why-a-pwa` | Someone using a phone, on the go |
| `/trust/build-status` | Someone reviewing a dashboard/progress tracker |
| `/trust/responsible-disclosure` | A security researcher at a laptop, focused, moodier lighting |
| `/solutions` (index) | Wide shot suggesting variety of institutes |
| `/product/admissions-and-growth` | Enquiry desk |
| `/product/academics-and-content` | Classroom/library |
| `/product/delivery-and-engagement` | Live class, teacher engaging students, hands raised |
| `/product/assessment-and-outcomes` | Exam/grading |
| `/product/money-and-people` | Finance/HR office |
| `/product/intelligence` | Person reviewing analytics |
| `/product/platform-and-trust` | Server room / architecture |
| `/product/modules/institute-website` | Building a website on a laptop |
| `/product/modules/media-and-content` | Video/content editing setup |
| `/product/modules/ai-assistance` | Person using an AI/chat tool |
| `/product/modules/learning-delivery` | Mobile/on-the-go learning |
| `/product/modules/batches-and-enrollment` | A classroom cohort |
| `/product/modules/certificates` | Certificate being handed over |

Known trouble spots — resolve these by actually looking at the images, don't guess:
- Two files are generically named `Person_working_on_laptop_...` (one timestamped 2252, one 2254). One of them is probably the `responsible-disclosure` security-researcher shot (dim room, screen-glow lighting, intense focus) — open both and decide which fits; if neither fits, say so.
- `Person_looking_at_monitor_202609032254.jpeg` is a likely candidate for `/trust/build-status` (dashboard) — confirm by viewing it.
- `/resources/buying-accessible-software` has no obvious new-batch match. Check the older files already at `public/images/` root: `Wheelchair_ramp_at_building_entr…_202609031829.jpeg` (there are two copies, dedupe the same way as Step 2 if identical) — see if it fits as an "accessible entrance" angle.
- `/product/delivery-and-engagement` (live classroom discussion) has no obvious new-batch match either. Check `Facilitator_presenting_in_corpor…_202609031830.jpeg` and `Facilitator_speaking_in_corporat…_202609031830.jpeg` — view them and judge if either reads as a classroom/teaching moment rather than purely corporate. If nothing fits, report it as genuinely missing rather than forcing a bad match.
- There are other older leftover files at root (`Student_reading_notice_board`, `Student_writing_in_notebook`, `Teachers_comparing_timetable…`, `Teachers_examining_printed_timet…`, `Two_people_reviewing_architectur…`) from an earlier photo round — check if any of them are already referenced by a page in the codebase (grep for the filename) before deciding whether to leave them, reuse them, or flag them as orphaned.

**Step 4 — Discover the existing convention.** Grep the codebase for how `public/images/pages/*.jpg` and `public/images/solutions/*.jpg` are referenced (component/data files, likely by slug matching the route). Follow that exact same pattern for every page above — same folder structure, same filename-by-slug convention, same way the path gets wired into the component (whether that's a data file, frontmatter, or inline import). For page families that don't have an existing folder yet (`/product/modules/*`, `/resources/*`, `/trust/*`, `/developers/webhooks`, `/about`, `/contact`), match whatever pattern the closest existing family uses rather than inventing a new one.

**Step 5 — Move, rename, wire in.** For each confirmed match: move the file into the correct location under the discovered convention, renamed to match that convention (e.g. `<slug>.jpg`), then update the page's component/data file to point to it.

**Step 6 — Alt text.** Write concise, accurate alt text per image describing the actual photographed scene (no marketing fluff, no restating the page's headline). Follow whatever alt-text convention already exists in the codebase (prop name, data field, etc.) and wire it in alongside the image.

**Step 7 — Sanity checks.** For each newly wired image: confirm there's no visible watermark, no readable stray text/logo baked into the shot, and that the image's aspect ratio won't force an awkward crop given how that slot renders it (check the surrounding CSS/`object-fit` — these were generated at 16:9, flag any slot that expects something else).

**Step 8 — Report.** Output a table: original filename → new path → page → alt text. Separately list any of the 27 pages still without an image, and any leftover/orphaned files you didn't use. Don't commit or push — leave the changes staged so I can review the diff first.
