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
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [sheet, setSheet] = useState(false);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();
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

  return (
    <header
      className={cn(
        // Always solid, never translucent.
        //
        // A see-through bar looks good over the hero and then crosses a dark section, where
        // its own dark link text lands on dark content at 3.7:1. It is a contrast failure that
        // only appears at certain scroll positions, which is the hardest kind to notice and
        // the easiest kind to avoid. The sentinel now decides only whether the hairline shows.
        'sticky top-0 z-50 bg-surface transition-[border-color] duration-200 ease-mk',
        solid ? 'border-b border-border' : 'border-b border-transparent',
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
          aria-label="Akechi — home"
        >
          <Wordmark />
        </Link>

        <div ref={navRef} className="hidden flex-1 items-center gap-1 lg:flex">
          {headerNav.map((item) =>
            item.menu !== undefined ? (
              <MenuTrigger
                key={item.label}
                label={item.label}
                menuKey={item.menu}
                open={open === item.menu}
                onToggle={() => setOpen(open === item.menu ? null : menuKeyOf(item))}
                onEnter={() => openWithIntent(menuKeyOf(item))}
                onLeave={closeWithIntent}
              />
            ) : (
              <Link
                key={item.label}
                href={item.href as Route}
                className="rounded px-3 py-2 text-mk-body-sm text-fg-muted transition-colors duration-fast hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        <div className="ms-auto flex items-center gap-2">
          <ThemeToggle />
          <CTA href={site.sandboxUrl} variant="secondary" external className="hidden sm:inline-flex">
            Open the sandbox
          </CTA>
          <CTA href="/demo" className="hidden sm:inline-flex">
            Book a walkthrough
          </CTA>

          <button
            type="button"
            aria-expanded={sheet}
            aria-controls="mobile-nav"
            onClick={() => setSheet(!sheet)}
            className="inline-flex h-11 min-w-[44px] items-center justify-center rounded-[--radius] border border-border px-3 text-mk-body-sm lg:hidden"
          >
            {sheet ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <div
          onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
          onMouseLeave={closeWithIntent}
          className="hidden border-t border-border bg-surface lg:block"
        >
          <MegaMenu menuKey={open} />
        </div>
      )}

      {sheet && <MobileSheet onClose={() => setSheet(false)} />}
    </header>
  );
}

function MenuTrigger({
  label,
  menuKey,
  open,
  onToggle,
  onEnter,
  onLeave,
}: {
  label: string;
  menuKey: MenuKey;
  open: boolean;
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
        open ? 'text-fg' : 'text-fg-muted hover:text-fg',
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
      className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto overscroll-contain bg-surface lg:hidden"
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
