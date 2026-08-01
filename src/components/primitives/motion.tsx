'use client';

// 'use client': these observe the viewport and hold mount state. Everything they wrap is
// server-rendered and already visible — see the Reveal comment below.

import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

/** Honours the OS setting and keeps honouring it if it changes mid-session. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Reveal on scroll.
 *
 * The critical detail: the child is **fully rendered and visible in the server HTML**. This
 * component adds `data-reveal="ready"` only *after* mount, then `"in"` on intersection. So with
 * JavaScript off, before hydration, or under reduced motion, the content is simply there.
 *
 * The usual implementation — `opacity: 0` in CSS, revealed by JS — makes content depend on
 * JavaScript, and on a slow connection it shows a reader a page of blank space. That is a
 * content bug wearing an animation's clothes (docs/07 §3.1).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section';
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'idle' | 'ready' | 'in'>('idle');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setState('in');
      return;
    }
    const node = ref.current;
    if (!node) return;

    /*
     * Anything already on screen when the page loads is not "revealed" — the reader is
     * looking at it. Fading it in would be an animation played to somebody who has already
     * started reading, and it briefly renders text at a partial opacity, which is a real
     * contrast problem as well as a silly one.
     */
    if (node.getBoundingClientRect().top < window.innerHeight) {
      setState('in');
      return;
    }

    setState('ready');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState('in');
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <Tag
      ref={ref as never}
      data-reveal={state === 'idle' ? undefined : state}
      style={delay ? ({ '--mk-reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * A revealed list with an internal stagger.
 *
 * Capped at 8 delayed children: past that the last item arrives half a second late and the
 * reader has already scrolled by. Items beyond the cap arrive with item 8.
 */
export function Stagger({
  children,
  step = 60,
  max = 8,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  step?: number;
  max?: number;
  className?: string;
  as?: 'div' | 'ul' | 'ol';
}) {
  const items = Array.isArray(children) ? children : [children];
  const ItemTag = Tag === 'div' ? 'div' : 'li';

  return (
    <Tag className={className}>
      {items.map((child, index) => (
        <Reveal key={index} delay={Math.min(index, max) * step} as={ItemTag}>
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}

/**
 * Counts once, at 60% visibility.
 *
 * `aria-live` is deliberately absent: a number announced digit by digit as it counts is
 * torture for a screen-reader user. The final value is in the server HTML, so assistive tech
 * and a reader with JS off both get the right number immediately.
 */
export function Counter({
  value,
  format,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const render = format ?? ((n: number) => n.toLocaleString('en-IN'));
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<number>(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();

          const duration = Math.min(800, 320 + Math.log10(Math.max(value, 1)) * 160);
          const start = performance.now();
          setDisplay(0);

          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(value * eased));
            if (t < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, reduced]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {render(display)}
    </span>
  );
}
