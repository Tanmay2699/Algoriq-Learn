# 18 — LAUNCH CHECKLIST

The gates between "the site is built" and "the domain points at it". **Any red item blocks the DNS
change.** No exceptions negotiated on the day — the point of writing this now is that it is decided
before anyone is under pressure.

---

## 1. Content and truth

- [ ] Every page in `03` §2 exists, or is listed as deferred in `19` with a reason
- [ ] `pnpm claims:check` green — every claim has evidence, nothing stale
- [ ] Every capture in `captures.json` is under 90 days old and taken against the current build
- [ ] Copy review (`17` §4) completed for every page by two people
- [ ] Every capability claim traced to `01-PRODUCT-TRUTH.md` §4 — **not** to a design doc
- [ ] Every module under 65% names its gap above the fold on its page
- [ ] Every comparison cell has a source URL and a retrieval date under 90 days
- [ ] `/trust/build-status` matches the product tracker as of the launch build
- [ ] `/pricing` matches the `plans` table (or the temporary snapshot warning is resolved)
- [ ] All seven proof slots empty and rendering `null`; the homepage reads as finished
- [ ] Zero instances of the banned vocabulary (`02` §7, `17` §7) — grep, do not trust memory
- [ ] Read the whole site aloud, end to end. It sounds like one writer.

## 2. Accessibility

- [ ] axe clean on every route, at 360 and 1440, light and dark (Playwright, in CI)
- [ ] Storybook axe green on every component and every state
- [ ] Contrast matrix test green, including ink and glass surfaces
- [ ] Keyboard-only pass of every page — no traps, visible focus everywhere, logical order
- [ ] Screen-reader pass: VoiceOver + Safari and NVDA + Firefox on `/`, `/security`, `/pricing`, `/demo`
- [ ] 400% zoom at 1280 → reflows to 320 CSS px with no horizontal scroll
- [ ] Text-spacing override applied — nothing clips
- [ ] Windows forced-colours mode — borders and focus rings survive
- [ ] Reduced-motion rendering verified on every page; the same text nodes are visible
- [ ] Target sizes ≥ 44×44 on touch, ≥ 8px separation
- [ ] `/accessibility` conformance statement published, dated, with **known issues listed**
- [ ] No `role="menu"` on the mega-menu; no positive `tabindex` anywhere

## 3. Performance

- [ ] Lighthouse median-of-5 on 10 routes: perf ≥ 98, a11y 100, best practices 100, SEO 100
- [ ] **Zero third-party requests** — Playwright assertion green
- [ ] First-load JS: homepage ≤ 90 KB, others ≤ 70 KB
- [ ] Fonts: 3 files, ≤ 118 KB, self-hosted, metric-matched, CLS from swap = 0
- [ ] CLS ≤ 0.02 on every route in the lab; 0.00 on the homepage
- [ ] LCP element is the H1 text node, verified in a trace
- [ ] No long task > 50ms during a full-page scroll on the reference device (`13` §8)
- [ ] Real-device check: mid-range Android on a real 4G connection, not throttled wifi
- [ ] Every image has intrinsic dimensions; AVIF + WebP present; `sizes` correct
- [ ] Caching headers per `13` §9

## 4. Cross-browser and device

- [ ] Chrome, Safari 17+, Firefox, Edge — current and current−1
- [ ] iOS Safari on iPhone SE (375), 15 (390), 15 Pro Max (430)
- [ ] Android Chrome on Pixel and a mid-range device
- [ ] iPad portrait and landscape
- [ ] 320px — nothing breaks, nothing scrolls horizontally
- [ ] 2560px and an ultrawide — the wide container holds, text does not stretch past 1280
- [ ] A foldable, unfolded and folded
- [ ] Dark mode on every page in every browser
- [ ] Print stylesheet on `/security`, `/pricing`, `/accessibility` — procurement prints these

## 5. SEO

- [ ] Every route has a unique title and description from `src/config/seo.ts`
- [ ] Canonicals absolute and self-referencing; `SITE_URL` is not localhost
- [ ] `sitemap.xml` complete and valid; `robots.txt` correct; `/demo` is `noindex`
- [ ] JSON-LD valid on every page; rich-results test passes; **no `AggregateRating`**
- [ ] OG images render and are legible at 300px wide on all four variants
- [ ] One H1 per page; heading outline is a real outline
- [ ] `pnpm links:check` green — no orphans, no broken internal links, no `http://`
- [ ] Preview deployments are `noindex` (header-enforced)
- [ ] Search Console verified before the DNS change, not after

## 6. Functionality

- [ ] The demo form creates a real lead on the product's admissions board — verified end to end
- [ ] `intent` and `ref` are recorded on the lead
- [ ] Form validation, error, success and upstream-failure paths all verified
- [ ] Honeypot and timing checks work; a normal human submission is not blocked
- [ ] `/api/plans` returns real plans; the ISR revalidation works
- [ ] OG route responds for every page slug and for an unknown one
- [ ] 404 returns a real 404 status; 500 renders
- [ ] Theme toggle persists and overrides the OS preference in **both** directions
- [ ] The sandbox link opens the right tenant, read-only, in a new tab
- [ ] Every outbound link has `rel="noopener"` and an announced "opens in a new tab"

## 7. Security

- [ ] CSP `default-src 'self'`; `security-headers.spec.ts` snapshot green
- [ ] HSTS set (preload submitted only after two clean weeks)
- [ ] All headers from `14` §7 present, verified against the deployed origin
- [ ] No secrets in the client bundle — `API_URL` and the tenant slug are absent from the output
- [ ] `pnpm audit` clean at moderate and above
- [ ] No source maps exposed in production
- [ ] Preview deployments are not publicly indexable and carry no production credentials

## 8. Analytics and measurement

- [ ] Self-hosted collector live on our own origin; the script is ≤ 2 KB and deferred
- [ ] Every event in `16` §3 fires once, with the right props, verified manually
- [ ] No PII, no free text, no ROI inputs, no search terms in any payload
- [ ] Web-vitals events arriving
- [ ] The four dashboards exist and have an owner's name on them
- [ ] The site behaves identically with analytics blocked

## 9. Legal and trust

- [ ] Terms, privacy, cookies, acceptable use, security policy — all published and dated
- [ ] The privacy page's seven commitments (`16` §7) are all true of the shipped site
- [ ] `/trust/sub-processors` accurate; the analytics row is genuinely empty
- [ ] DPA downloadable and versioned
- [ ] Responsible-disclosure page live with a monitored address
- [ ] Trademark acknowledgement in the footer for every competitor named
- [ ] No customer name, logo or quote anywhere

## 10. Operations

- [ ] Production deploy from `main` with all ten CI gates green
- [ ] Rollback verified — an alias repoint takes under a minute
- [ ] DNS: apex → host, `www` → 301 apex, TTL lowered 24h before the change and restored after
- [ ] `app`, `api` and `sandbox` records untouched
- [ ] TLS valid, auto-renewing, A+ on a scan
- [ ] Uptime monitoring on `/` and `/api/plans` with an alert that reaches a person
- [ ] An owner named for the first 72 hours

---

## 11. Launch day

| # | Step | Owner |
|---:|---|---|
| 1 | Freeze content 24h before. No copy changes after the freeze. | Writer |
| 2 | Final full CI run on `main` — all ten gates | Engineer |
| 3 | Deploy to production, verify on the deployment URL before DNS | Engineer |
| 4 | Manual smoke: homepage, pricing, security, demo submit, sandbox link, 404 | All |
| 5 | DNS cutover | Engineer |
| 6 | Verify HTTPS, headers, canonicals on the live domain | Engineer |
| 7 | Submit the sitemap to Search Console | Owner |
| 8 | Watch: errors, 404s, CWV, form submissions — hourly for 6 hours | Owner |
| 9 | 72-hour review: funnel, CWV, errors, and the first honest read of the act funnel | All |

**Rollback trigger:** any of — the demo form failing, a CSP violation blocking a page, LCP p75 over
3s, an accessibility regression on a primary route, or a factually wrong claim discovered live.
Repoint the alias, fix, redeploy. Do not debug in production with the domain live.

---

## 12. First 30 days

- [ ] Week 1: baseline every metric in `10` §2. These become the real targets.
- [ ] Week 1: first act-funnel read — where does the story lose people?
- [ ] Week 2: fix the largest funnel drop. One change, measured.
- [ ] Week 2: Search Console index coverage; fix anything not indexed
- [ ] Week 3: first design-partner conversations from `?intent=design-partner`
- [ ] Week 4: capture-freshness check; claim re-verification for `per-release` claims
- [ ] Week 4: decide whether any experiment in `10` §9 now has the traffic to be worth running
- [ ] Week 4: write down what the site got wrong, in `19`. Every launch has three of them.
