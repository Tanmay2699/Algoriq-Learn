# 17 — EVIDENCE & CLAIMS POLICY

**The rule this site is built on: every claim resolves to something a stranger can check.**

Inherited from the product's first working rule — *no fabricated data, ever* — and made
enforceable here, because a marketing site is where that rule is under the most pressure.

---

## 1. Why this is a document and not a paragraph

Three weeks before launch, someone will say: *"we need logos on the homepage, just use grey
placeholders, we'll swap them"*. Placeholders ship. The purpose of this document is that the answer
to that request is already written down, was agreed when nobody was under pressure, and is enforced
by a build gate rather than by whoever is in the room.

The second purpose: our honesty is not a compromise we are making because we are early. It is the
**strategy** (`02` §8, objections 13–16). Every competitor can claim enterprise-grade security.
None of them will publish their permission catalog, their RLS exemption list, their module
completeness percentages or their accessibility failures. That asymmetry is the whole position, and
one fake logo destroys it.

---

## 2. The claims registry

Every number, capability statement and comparative claim on the site is registered in
`src/lib/claims.ts`:

```ts
export const claims = {
  'permission-keys': {
    value: 272,
    statement: '272 permission keys',
    evidence: {
      kind: 'code',
      path: 'packages/authz/src/catalog.ts',
      command: 'pnpm authz:check',
    },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'rls-tables': {
    value: 114,
    statement: 'row-level security on 114 tables',
    evidence: { kind: 'code', command: 'pnpm --filter @akechi/api db:rls:check' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'no-cloud-sdk': {
    statement: 'no cloud-provider SDK is imported in feature code',
    evidence: { kind: 'doc', path: 'CLAUDE.md', anchor: 'rule-10' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
} satisfies Record<string, Claim>;
```

Rendered through `<Claim id="permission-keys" />` or `<StatBlock evidence="rls-tables" …/>`.
**`StatBlock` does not compile without an `evidence` key** (`06` §2.7) — the type system carries the
policy so review does not have to.

### `pnpm claims:check` fails the build when

- A `<Claim>` or `<StatBlock>` references an id that does not exist.
- A registered claim has no evidence pointer.
- An evidence `path` does not exist in the repository.
- A `per-release` claim's `verifiedAt` predates the current product version's release date.
- A `quarterly` claim is more than 120 days old.
- A capture in `captures.json` is older than 180 days (90 days is a warning).
- A comparison cell has no `source` or `retrievedAt` (§5).

---

## 3. Claim classes and what each requires

| Class | Example | Requirement |
|---|---|---|
| **Countable** | "272 permission keys", "497 API routes" | A command that reproduces it, run at the stated date. Numbers are exact, never rounded up. "Over 250" is allowed; "300+" when the number is 272 is not. |
| **Mechanism** | "isolation is an RLS policy with FORCE" | A file path. The claim must describe what the code does, not what the design doc intends. |
| **Capability** | "you can restore a course version and see the diff" | The feature must be reachable in the product by a role that exists, and it must appear in `01-PRODUCT-TRUTH.md` §4. |
| **Absence** | "there is no payment gateway adapter" | Also evidence-backed. An absence claim that is wrong is as damaging as a presence claim that is wrong — and these are the claims that earn the page its credibility. |
| **Comparative** | "unlike X, we…" | §5. |
| **Third-party** | a certification, an audit, an award | Only after the certificate, report or notification exists, with a date and, where possible, a link to the issuing body. |
| **Performance** | "loads in under two seconds" | Measured, on the reference device (`13` §8), at the stated percentile, dated. |
| **Outcome** | "institutes save N hours" | **Not permitted.** We have no customers. The ROI calculator computes on the visitor's numbers instead (`10` §6). |

---

## 4. Copy review procedure

Every page passes a two-person check before it ships:

1. **The writer** lists each claim in the page and its `claims.ts` id.
2. **The reviewer** opens `01-PRODUCT-TRUTH.md` and, for each claim, confirms it appears there.
   *Marketing docs are not an acceptable source.* `docs/00-MASTER.md` and `docs/02-SRS.md` in the
   product repo describe the product **as designed**; the tracker and the code describe it **as
   built**. Copy written from the design docs is how a website starts describing features that do
   not exist, and it is the single likeliest failure mode of this project.
3. Anything not in `01` is either cut or is added to `01` **after** verifying it in the code.
4. Any module below 65% completeness gets its gap named on the page, above the fold.

---

## 5. Comparison claims

Comparison pages carry the highest legal and reputational risk on the site, and they are also the
highest-traffic entry points. Rules:

1. **One source URL and one retrieval date per cell**, stored in
   `src/content/comparisons/*.json` and rendered as a footnote.
2. **Only official sources**: the competitor's own documentation, pricing page or release notes.
   Never a third-party review site, never a forum post, never "in our testing".
3. **Where they are better, we say so.** A table where one column wins every row is not read as a
   comparison; it is read as an advertisement, and it is dismissed.
4. **No trademarks, logos or brand styling.** Names in plain text, with a trademark
   acknowledgement in the footer.
5. **No pejoratives.** Not "legacy", not "clunky", not "outdated". Their users are our prospects,
   and the tone tells a reader more about us than about them.
6. **Re-verified quarterly.** A cell older than 180 days renders a visible "last verified" notice;
   older than 270 days, the page is unpublished until it is checked.
7. **A correction path.** `/compare/*` carries a line: *"Found something out of date? Tell us and
   we will fix it."* with an email address. We have fixed it within five working days, every time,
   or the line comes down.

---

## 6. The proof slots

| Slot | Launch state | Fills when |
|---|---|---|
| Customer logos | `null` | A customer signs a written permission to use their name and mark |
| Testimonials | `null` | A named person at a named institute approves a specific quote in writing |
| Case studies | `null` | 90 days of real usage, with the customer's own numbers, approved in writing |
| Awards | `null` | An award exists |
| Certifications | `null` | A certificate exists. **The SOC 2 policy set and evidence pack are not a certification**, and the copy says so precisely: *"we have built the evidence machinery; the audit is scheduled"*. |
| Uptime / SLA | `null` | Real telemetry exists and an SLA has been written |
| Ratings | `null` | Reviews exist. **`AggregateRating` schema is never emitted without them** (`11` §3). |

Each component returns `null` on empty input. The homepage is designed to read as finished with all
seven empty — verified by a visual test against the empty-proof rendering (`15` §7).

---

## 7. Language rules that follow from the policy

| Never | Instead |
|---|---|
| "Trusted by leading institutes" | "We have no customer logos to show you yet. Here are six things you can check." |
| "Enterprise-grade security" | "Isolation is an RLS policy with FORCE on 114 tables. Here are the 13 exemptions." |
| "99.9% uptime" | Nothing, until there is telemetry. |
| "GDPR compliant" | "DSR flows, retention policies, legal holds and an erasure job that tombstones rather than rewriting the audit chain." |
| "AI-powered" | "Course outline and lesson drafting. The provider is a port and the default is disabled. Nothing reaches a course without a human pressing apply." |
| "Unlimited" | The actual quota, or "unlimited on Enterprise, negotiated". |
| "Coming soon" | A date, or nothing. "Soon" is a promise with no cost attached. |
| "Seamless integration" | The list of what is built and the list of what is a port with no driver. |
| "Used by thousands of learners" | The seeded demo institute's real numbers, labelled as seeded. |

---

## 8. Handling the pressure

Three requests that will arrive, with the answer already written:

> **"Just put six grey placeholder logos there, it looks empty."**
> The components cannot render them and the build gate fails. More usefully: the empty rendering
> was designed and approved (`15` §7); it does not look empty, it looks restrained. And the first
> prospect who asks "who are these?" costs more than the section gains.

> **"Everyone rounds up. Say 300 permission keys."**
> 272 is a more convincing number than 300 precisely because it is odd. Specificity is the signal.

> **"Can we say SOC 2 in progress?"**
> Only once a readiness engagement is actually booked, and then in those words with the date. "In
> progress" without an engagement is a claim about the future stated in the present tense.

> **"The competitor's page says they do X; ours should say we do X better."**
> Only if we do X. If we do not, it goes on `/trust/build-status`, and the honest gap is what makes
> the rest of the page believable.

---

## 9. Correction procedure

When something on the site turns out to be wrong:

1. Fix it within one working day. A wrong claim is a production incident.
2. If it was materially misleading and was live for more than a week, note it on `/changelog` with
   the date and the correction. Nobody else in this category does this; it is cheap and it compounds.
3. Add a test if a test could have caught it.
4. Note it in `19-PROGRESS-TRACKER.md` — including what let it through.
