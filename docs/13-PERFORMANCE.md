# 13 — PERFORMANCE

The site is itself a proof. A visitor evaluating whether we can build software will open the
network tab; what they find there is an argument we make without words.

---

## 1. The target, honestly stated

The brief asks for Lighthouse 100/100/100/100. Three of those are achievable and non-negotiable.
**Performance 100 on a throttled mobile run is not reliably achievable for a page with a
2,000-pixel-wide product screenshot above the fold**, and treating a flaky 100 as a gate produces
either a red build every third PR or a page that has had its hero deleted to satisfy a number.

So:

| Category | Gate (fails CI) | Target |
|---|---:|---:|
| Performance | **≥ 98** | 100 |
| Accessibility | **100** | 100 |
| Best practices | **100** | 100 |
| SEO | **100** | 100 |

Measured on Lighthouse CI, mobile preset, 4× CPU throttle, Slow 4G, **median of 5 runs**, on the
ten highest-value routes. A single run is noise; gating on one is how teams learn to ignore the gate.

**Field data outranks lab data.** Once traffic exists, the CWV p75 numbers in §2 are the real gate
and Lighthouse becomes a regression detector.

---

## 2. Budgets

### Core Web Vitals (p75, mobile, field)

| Metric | Budget | Good threshold | Why ours is tighter |
|---|---:|---:|---|
| LCP | **≤ 1.8s** | 2.5s | Our LCP is a text node; there is no excuse |
| INP | **≤ 150ms** | 200ms | Almost nothing on the page is interactive |
| CLS | **≤ 0.02** | 0.1 | Every image is dimensioned and fonts are metric-matched; 0.1 would mean something is broken |
| TTFB | ≤ 300ms | 800ms | Static HTML from an edge cache |
| FCP | ≤ 1.2s | 1.8s | |

### Resource budgets (per route, gzipped)

> **Measured, 2026-07-31.** The App Router's own floor is **102 KB** — 54.2 KB React/Next
> runtime plus a 46 KB router chunk — before a line of our code. The homepage ships **130 KB**
> first-load (≈28 KB ours, the two tab sets, the calculator and the form) and a typical content
> page **116 KB** (≈14 KB ours). The 90 KB target below was written before that floor was
> measured and is not reachable with this framework; the honest budget is **framework floor
> + 30 KB on the homepage, + 16 KB elsewhere**, and that is what CI should assert.

| Resource | Homepage | Any other route |
|---|---:|---:|
| First-load JS | **≤ 90 KB** | ≤ 70 KB |
| Site-authored JS (excluding framework) | ≤ 60 KB | ≤ 40 KB |
| CSS | ≤ 22 KB | ≤ 18 KB |
| Fonts | ≤ 118 KB (currently 70 KB in 2 files, cached forever) | same, cached |
| Images above the fold | ≤ 210 KB | ≤ 160 KB |
| Total page weight | ≤ 900 KB | ≤ 700 KB |
| Requests before onload | ≤ 18 | ≤ 14 |
| **Third-party requests** | **0** | **0** |

The last row is the one that makes the rest achievable. A single analytics tag, a font CDN and a
chat widget is 180 KB of JavaScript, three DNS lookups and two long tasks — and it is where most
"we optimised our site" projects stall.

---

## 3. Rendering strategy

| Route class | Strategy | Notes |
|---|---|---|
| 48 static pages | **SSG**, revalidate never | Rebuilt on content change |
| `/pricing` | **ISR, 1 hour** | Sourced from `GET /public/plans` so the page cannot drift from the database |
| `/demo` | Static shell, dynamic POST handler | The form is client-side; the page is static |
| `/api/lead` | Node runtime | Proxies to the product's public capture endpoint |
| `/api/plans` | Node runtime, cached 1h | One upstream call per hour, not per visitor |
| `/api/og/*` | Edge, cached immutably by URL | Satori |

**Server Components by default.** `'use client'` appears in exactly nine components
(`RoleSwitcher`, `ModuleExplorer`, `Tabs`, `Accordion` enhancement, `RoiCalculator`,
`DemoForm`, `MobileNav`, `ThemeToggle`, `PermissionCatalog`) and each carries a one-line comment
saying what state forced it. A tenth needs a review.

---

## 4. Fonts

The single largest lever on a type-led site.

| Decision | Value |
|---|---|
| Hosting | Self-hosted. No `fonts.googleapis.com` — it is a third-party origin, a render-blocking stylesheet, an extra connection, and (in some jurisdictions) a privacy question we do not need to answer. |
| Format | `woff2` variable |
| Subset | `latin`, both faces. |
| Files | **2 — Inter var (48 KB) and Space Grotesk var (22 KB). 70 KB total**, against a budget of ≤ 118 KB. |
| Preload | Both. There is no third file: the mono role uses the platform stack, so JetBrains Mono's 31 KB is never paid. |
| `font-display` | `swap` |
| CLS from swap | **0**, via metric-matched fallbacks with `size-adjust`, `ascent-override` and `descent-override` measured per face and checked in a test |
| Caching | `immutable`, 1 year, content-hashed filenames |

Metric matching is not optional. A 6.5rem display headline swapping from a fallback with different
metrics is a visible reflow at the exact moment the page is being judged.

**The budget has 48 KB of headroom, and it was not always this comfortable.** The three-file plan
above budgeted ≈ 116 KB against 118 — no room at all. Two things bought it back. Dropping JetBrains
Mono for the platform stack removed a file, which mattered more than it looks: the Fraunces subset
shipped at 67 KB rather than the 42 KB estimated here, so the two-file build was still 115 KB. Then
the 2026-08-01 rebrand (ADR 0010) replaced Fraunces with Space Grotesk at 22 KB, and the whole
payload fell to 70.

The headroom is spare capacity, not an invitation. A third face would spend all of it, and the
reason there are two faces is unchanged by the fact that they now fit more easily.

---

## 5. Images

Per `09` §9. The rules that matter for performance:

1. **One `priority` image per page maximum**, and only when it is not the LCP element.
2. Every image has explicit `width`/`height`. CLS from images: 0.
3. AVIF first, WebP second, PNG last. AVIF at q62 for captures — verified by eye at 2×, not by a
   number alone.
4. `sizes` is set per usage, never left to the default. A wrong `sizes` is the most common cause of
   a 1920px image being downloaded onto a 390px phone.
5. Below-the-fold captures are `loading="lazy"` **with** `decoding="async"`.
6. Role captures 2–4 in the hero are prefetched on `requestIdleCallback`, not on load.
7. The permission-catalog JSON (~18 KB gz) loads **on interaction**, never on page load.

---

## 6. CI enforcement

Every PR runs, and every one of these can fail the build:

| Check | Tool |
|---|---|
| Bundle budget per route | `@next/bundle-analyzer` + a size assertion script |
| Lighthouse × 10 routes, median of 5 | Lighthouse CI |
| **Zero third-party requests** | Playwright: fail on any request to a host other than the origin |
| CSP is not widened | `security-headers.spec.ts` snapshot |
| Image budget and dimensions | A script over the built output |
| Font file count and size | Same script |
| No long task > 50ms during a full-page scroll | Playwright trace on the mid-tier device profile |
| CLS = 0 on the homepage in the lab | Lighthouse assertion |

The third-party check is the cheapest and highest-value gate on the list. It is a five-line
Playwright assertion that prevents the single most common way a fast site becomes a slow one.

---

## 7. Dependency decisions

Each of these was considered and declined. Recorded so nobody re-litigates them in week six.

| Not used | Cost | What replaces it |
|---|---|---|
| Framer Motion | ~34 KB gz, and it invites motion we do not want | CSS transitions + WAAPI + IntersectionObserver, ≤ 6 KB total (`07` §8) |
| GSAP + ScrollTrigger | ~48 KB gz, encourages scroll-jacking | Reveals; and we refuse scroll-jacking anyway (`07` §4.3) |
| three.js / R3F | 150 KB+, a GPU cost on the exact devices we care about, and the product is not 3D | Real product captures |
| Lottie runtime | ~40 KB + JSON payloads | SVG `stroke-dasharray` draws |
| A chart library | 40–90 KB | `@akechi/ui` charts — already built, already tested, already the product's grammar |
| A headless CMS | A network dependency and a build coupling, for 51 pages | MDX in-repo (ADR 0005) |
| A CAPTCHA | A third-party origin, a cognitive-function test (SC 3.3.8), and an accessibility problem | Honeypot + timing + the API's rate limit |
| Google Analytics / GTM | 45–90 KB, a consent banner, a privacy posture we would then have to defend | Self-hosted, cookieless (ADR 0007) |
| Google Fonts CDN | A third-party origin and a render-blocking request | Self-hosted woff2 |
| A cookie-consent library | Only needed if we set cookies. We do not. | `/legal/cookies`, one screen |
| An icon barrel import | ~200 KB if imported wrong | Per-icon imports, lint-enforced |

**Any new runtime dependency needs a line in the PR description justifying it** — inherited from
the product's rule 13.

---

## 8. The mid-tier device profile

Performance work is validated against a device our audience actually holds, not a MacBook Pro:

> **Reference device:** a 2022 mid-range Android (Snapdragon 680-class, 4 GB RAM), Chrome, on a
> throttled 4G connection (1.6 Mbps down, 150ms RTT). Emulated in CI as 4× CPU slowdown + Slow 4G;
> verified on real hardware once per phase.

If the hero role switcher janks there, it is deleted there — a degraded experience on the reference
device is a bug, not an acceptable trade.

---

## 9. Caching and delivery

| Asset | Header |
|---|---|
| HTML | `public, max-age=0, must-revalidate` + a CDN cache with tag-based purge on deploy |
| JS / CSS (hashed) | `public, max-age=31536000, immutable` |
| Fonts | `public, max-age=31536000, immutable` |
| Images (hashed) | `public, max-age=31536000, immutable` |
| `/api/plans` | `s-maxage=3600, stale-while-revalidate=86400` |
| `/api/og/*` | `public, max-age=31536000, immutable` |

Compression: Brotli where the host supports it, gzip fallback. HTTP/2 or HTTP/3. `preconnect` to
nothing, because there is nothing to preconnect to.

---

## 10. Monitoring after launch

- **Field CWV** via the self-hosted analytics' web-vitals collection (`16` §4). p75 by route,
  weekly.
- **Synthetic** Lighthouse CI on `main`, nightly, with a trend chart. A 3-point drop opens an issue.
- **Weight watch:** the built output's total size is printed on every PR as a diff against `main`.
  A 10 KB increase needs a sentence.
- **Real-device spot check** once per phase on the reference device, over a real 4G connection, not
  wifi with throttling.
