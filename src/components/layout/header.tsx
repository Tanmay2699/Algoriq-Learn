'use client';

// 'use client': the header holds open-menu state, an intersection sentinel and the mobile sheet.

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/cn';
import { clusters, header as headerNav, resources, solutions } from '../../config/navigation';
import { site } from '../../config/site';
import { CTA } from '../primitives';
import { ThemeToggle } from './theme-toggle';
import { Wordmark } from './wordmark';

type MenuKey = 'product' | 'solutions' | 'resources';

/**
 * The nav registry types `menu` as optional, and a callback closing over the item cannot be
 * narrowed by the surrounding ternary. Reading it through here keeps the narrowing without a
 * non-null assertion — and returns a sane default rather than crashing if the registry ever
 * grows an entry with neither an href nor a menu.
 */
function menuKeyOf(item: { menu?: MenuKey }): MenuKey {
  return item.menu ?? 'product';
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [sheet, setSheet] = useState(false);
  const [solid, setSolid] = useState(false);
  const [overHero, setOverHero] = useState(pathname === '/');
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A sentinel rather than a scroll listener: one observer, no work on every frame.
  useEffect(() => {
    const sentinel = document.getElementById('header-sentinel');
    if (!sentinel) {
      setSolid(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setSolid(!entry?.isIntersecting), {
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pathname]);

  /*
   * The video hero's own sentinel, independent of the one above. It exists only on the
   * homepage — `getElementById` returns null everywhere else — so every other route is
   * entirely unaffected and keeps the exact background/border logic this header has always
   * had. Where it does exist, it sits at the hero's bottom edge (see `VideoHero`), so
   * `overHero` is true for exactly as long as that edge has not yet scrolled past the
   * viewport top.
   *
   * This is deliberately a second, independent observer rather than a second reading of the
   * one above: the two sentinels answer different questions ("has the reader scrolled at
   * all" vs "are they still over the hero"), and folding them into one boolean is how the
   * hairline and the transparency end up coupled when a page has neither, one, or both.
   */
  useEffect(() => {
    const sentinel = document.getElementById('hero-video-sentinel');
    if (!sentinel) {
      setOverHero(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setOverHero(!!entry?.isIntersecting), {
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pathname]);

  // Route change closes everything. Without this, a mega-menu link leaves the menu open over
  // the page it navigated to.
  useEffect(() => {
    setOpen(null);
    setSheet(false);
  }, [pathname]);

  useEffect(() => {
    if (!open && !sheet) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(null);
        setSheet(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, sheet]);

  // Body scroll lock while the mobile sheet is open, with the position preserved.
  useEffect(() => {
    if (!sheet) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [sheet]);

  const openWithIntent = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(key), 120);
  };
  const closeWithIntent = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 240);
  };

  const isBlended = overHero && !solid && !open;

  return (
    // A fragment, not a single `<header>` root: `backdrop-filter` (both branches below,
    // `backdrop-blur-md`) establishes a new containing block for `position: fixed`
    // descendants, per spec. `MobileSheet` is `fixed inset-x-0 bottom-0 top-16` and needs
    // that measured against the *viewport* — nested inside the header it was instead
    // measured against the header's own 64px box, and `top-16` plus `bottom-0` inside a
    // 64px-tall containing block resolves to zero height. The sheet was rendering, entirely
    // present in the DOM, at a height of exactly nothing — which is why this surfaced as a
    // Playwright "hidden" failure and not a visual bug anyone would have spotted by eye up
    // to the exact pixel. Rendering it as a sibling instead keeps the header's own glass
    // treatment and gives the sheet back the real viewport as its containing block.
    <>
      <header
        className={cn(
          // No `background-color` in this transition, on purpose: `color` (below, on every
          // child) has none, so it snaps to its final value the instant `isBlended` flips,
          // while a smoothly-EASING background would still be mid-fade at that exact moment —
          // on-ink text, already fully light, sitting over a background only partway to dark.
          // Axe caught that window directly: a real, if sub-200ms, contrast failure. Snapping
          // both together removes the window instead of narrowing it.
          'sticky top-0 z-50 transition-[border-color,box-shadow] duration-200 ease-mk',
          isBlended
            ? [
                // An explicit arbitrary value, not a `bg-ink-900/NN` opacity modifier:
                // `ink.900` resolves to a bare `var(--mk-ink-900)` reference, which Tailwind
                // cannot parse at build time to inject alpha into — the modifier is silently
                // dropped and the header renders fully opaque. Writing the rgba by hand
                // sidesteps that.
                //
                // Translucent, not fully transparent, for the same reason as the transition
                // above: axe's `color-contrast` walks the DOM ancestor chain for a declared
                // background and cannot see the hero's own scrim, which is a sibling of the
                // header, not an ancestor of it. `rgb(7 12 24 / 0.75)` is a real background
                // in the text's own ancestor chain, and it clears AAA on its own even
                // composited against a worst-case white behind it — see the contrast note in
                // `docs/09-VISUAL-LANGUAGE-AND-ASSETS.md` §10 for the numbers.
                'bg-[rgb(7_12_24_/_0.75)] backdrop-blur-md border-b border-transparent',
                'hero-on-video',
              ]
            : [
                'bg-surface/95 backdrop-blur-md',
                solid ? 'border-b border-border shadow-xs' : 'border-b border-transparent',
              ],
        )}
        onBlur={(event) => {
          // Tabbing out of the nav closes the menu.
          if (!navRef.current?.contains(event.relatedTarget)) setOpen(null);
        }}
      >
        <div className="container-mk flex h-16 items-center gap-6">
          <Link
            href="/"
            className="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-4"
            aria-label="Algoryq Learn — home"
          >
            <Wordmark surface={isBlended ? 'ink' : 'paper'} />
          </Link>

          {/*
            The desktop nav appears at `xl` (1280), not `lg` (1024) — measured, not preferred.

            The bar wants 1212px: a 175px wordmark, a 583px six-item nav and 226px of
            controls, plus 48px of gaps. `.container-mk`'s gutter is fluid, so the content box
            is 964px at 1024 and 1212px at 1280. At `lg` the row is therefore ~248px over
            budget, and because `globals.css` sets `min-width: 0` on flex children inside the
            container, nothing announces that: the `flex-1` nav simply shrinks and its links
            slide under the CTAs. A collision that renders is worse than a hamburger that
            works, so below 1280 the nav goes in the sheet. docs/06 §3.1 records the number.
          */}
          <div ref={navRef} className="hidden flex-1 items-center gap-1 xl:flex">
            {headerNav.map((item) =>
              item.menu !== undefined ? (
                <MenuTrigger
                  key={item.label}
                  label={item.label}
                  menuKey={item.menu}
                  open={open === item.menu}
                  onInk={isBlended}
                  onToggle={() => setOpen(open === item.menu ? null : menuKeyOf(item))}
                  onEnter={() => openWithIntent(menuKeyOf(item))}
                  onLeave={closeWithIntent}
                />
              ) : (
                <Link
                  key={item.label}
                  href={item.href as Route}
                  className={cn(
                    'rounded px-3 py-2 text-mk-body-sm transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2',
                    isBlended ? 'text-on-ink-muted hover:text-on-ink' : 'text-fg-muted hover:text-fg',
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="ms-auto flex items-center gap-2">
            <ThemeToggle surface={isBlended ? 'ink' : 'paper'} />
            {/*
              "Sandbox", not "Open the sandbox" — this is the one place on the site that
              abbreviates it. The full label is 173px against this one's 102px, and those 71px
              are the whole difference between the nav clearing the CTAs at 1280 and colliding
              with them. The verb survives everywhere it has room to: the hero, the Product
              mega-menu and the mobile sheet all still say "Open the sandbox". The accessible
              name is not abbreviated either — `external` appends "(opens in a new tab)".

              Both CTAs wait for `md` rather than `sm`: at 640 the wordmark, the controls and
              the Menu button come to 612px inside a 592px box, which is the same overflow one
              breakpoint down.
            */}
            <CTA
              href={site.sandboxUrl}
              variant="secondary"
              surface={isBlended ? 'ink' : 'paper'}
              external
              className="hidden md:inline-flex"
            >
              Sandbox
            </CTA>
            <CTA href="/demo" surface={isBlended ? 'ink' : 'paper'} className="hidden md:inline-flex">
              Book a walkthrough
            </CTA>

            <button
              type="button"
              aria-expanded={sheet}
              aria-controls="mobile-nav"
              onClick={() => setSheet(!sheet)}
              className={cn(
                'inline-flex h-11 min-w-[44px] items-center justify-center rounded-[--radius] border px-3 text-mk-body-sm xl:hidden',
                isBlended ? 'border-ink-border-strong text-on-ink' : 'border-border text-fg',
              )}
            >
              {sheet ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {open && (
          <div
            onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
            onMouseLeave={closeWithIntent}
            className="hidden border-t border-border bg-surface xl:block"
          >
            <MegaMenu menuKey={open} />
          </div>
        )}
      </header>
      {sheet && <MobileSheet onClose={() => setSheet(false)} />}
    </>
  );
}

function MenuTrigger({
  label,
  menuKey,
  open,
  onInk,
  onToggle,
  onEnter,
  onLeave,
}: {
  label: string;
  menuKey: MenuKey;
  open: boolean;
  /** True while the header is blended over the video hero — see `SiteHeader`'s `overHero`. */
  onInk: boolean;
  onToggle: () => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={`menu-${menuKey}`}
      onClick={onToggle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        'rounded px-3 py-2 text-mk-body-sm transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2',
        onInk
          ? open
            ? 'text-on-ink'
            : 'text-on-ink-muted hover:text-on-ink'
          : open
            ? 'text-fg'
            : 'text-fg-muted hover:text-fg',
      )}
    >
      {label}
      <span aria-hidden="true" className="ms-1.5 text-caption">
        ▾
      </span>
    </button>
  );
}

/**
 * `role="group"`, deliberately not `role="menu"`.
 *
 * These are links to pages. `role="menu"` promises application-menu semantics — arrow-key-only
 * navigation, no Tab — that we do not implement, and a screen-reader user who is told to expect
 * them and does not get them is worse off than one given a plain group of links.
 */
function MegaMenu({ menuKey }: { menuKey: MenuKey }) {
  const id = `menu-${menuKey}`;
  const headingId = useId();

  if (menuKey === 'product') {
    return (
      <div id={id} role="group" aria-labelledby={headingId} className="container-mk py-8">
        <h2 id={headingId} className="sr-only">
          Product
        </h2>
        <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {clusters.map((cluster) => (
              <li key={cluster.key}>
                <Link
                  href={cluster.href as Route}
                  className="block rounded-[--radius] p-3 transition-colors duration-fast hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span className="block text-mk-body font-medium text-fg">{cluster.label}</span>
                  <span className="mt-0.5 block text-mk-body-sm text-fg-muted">{cluster.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="rounded-lg border border-border bg-surface-muted p-5">
            <p className="text-caption font-medium uppercase tracking-wide text-fg-muted">
              Rather look than read
            </p>
            <ul className="mt-3 space-y-2 text-mk-body-sm">
              <li>
                <a href={site.sandboxUrl} target="_blank" rel="noopener noreferrer" className="text-link underline underline-offset-4">
                  Open the live sandbox
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <Link href="/product" className="text-link underline underline-offset-4">
                  All thirty-one modules
                </Link>
              </li>
              <li>
                <Link href="/trust/build-status" className="text-link underline underline-offset-4">
                  What we haven&apos;t built
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const links = menuKey === 'solutions' ? solutions : resources;

  return (
    <div id={id} role="group" aria-labelledby={headingId} className="container-mk py-8">
      <h2 id={headingId} className="sr-only">
        {menuKey === 'solutions' ? 'Solutions' : 'Resources'}
      </h2>
      <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href as Route}
              className="block rounded-[--radius] p-3 transition-colors duration-fast hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="block text-mk-body font-medium text-fg">{link.label}</span>
              {link.blurb && <span className="mt-0.5 block text-mk-body-sm text-fg-muted">{link.blurb}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileSheet({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  // Focus the sheet on open, and trap Tab inside it while it is up.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const focusables = node.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusables[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, []);

  const groups: { label: string; links: { href: string; label: string }[] }[] = [
    { label: 'Product', links: clusters.map(({ href, label }) => ({ href, label })) },
    { label: 'Solutions', links: solutions.map(({ href, label }) => ({ href, label })) },
    {
      label: 'More',
      links: [
        { href: '/pricing', label: 'Pricing' },
        { href: '/security', label: 'Security' },
        { href: '/developers', label: 'Developers' },
        { href: '/trust/build-status', label: 'Build status' },
        { href: '/resources', label: 'Resources' },
        { href: '/about', label: 'About' },
      ],
    },
  ];

  return (
    <div
      ref={ref}
      id="mobile-nav"
      className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto overscroll-contain bg-surface xl:hidden"
    >
      <nav aria-label="Site" className="container-mk py-6">
        {groups.map((group) => (
          <section key={group.label} className="mb-6">
            <h2 className="text-caption font-medium uppercase tracking-wide text-fg-muted">{group.label}</h2>
            <ul className="mt-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href as Route}
                    onClick={onClose}
                    className="flex min-h-[44px] items-center border-b border-border text-mk-body text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <div className="sticky bottom-0 border-t border-border bg-surface p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex flex-col gap-2">
          <CTA href="/demo" size="lg">
            Book a walkthrough
          </CTA>
          <CTA href={site.sandboxUrl} variant="secondary" size="lg" external>
            Open the sandbox
          </CTA>
        </div>
      </div>
    </div>
  );
}
