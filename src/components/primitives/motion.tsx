'use client';

// 'use client': these observe the viewport and hold mount state. Everything they wrap is
// server-rendered and already visible — see the Reveal comment below.

import { useCallback, useEffect, useRef, useState } from 'react';
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
 * A switcher that advances by itself until somebody takes it over.
 *
 * The hero and the module explorer both show one surface at a time out of four or seven, and
 * a visitor who never touches them sees exactly one of those surfaces. Advancing on a timer is
 * how the reel shows the whole set — the architecture claim is *four dashboards*, and a
 * screenshot of one is not that claim.
 *
 * Everything below is about giving the control back:
 *
 *  - **Reduced motion turns it off entirely.** Content that moves on its own is the single
 *    worst offender for vestibular disorders; there is no "gentler" version to fall back to.
 *  - **It stops for good on the first interaction.** Not pauses — stops. A carousel that
 *    resumes after you have chosen a panel takes the panel away again, which is why
 *    auto-advancing tabs have the reputation they have. WCAG 2.2 §2.2.2 wants a mechanism to
 *    pause; the honest mechanism is that using the thing ends the show.
 *  - **It only runs on screen and in a visible tab.** A timer firing against a section nobody
 *    is looking at is a re-render for nothing, and in a background tab it is a battery bug.
 *  - **Hover and keyboard focus hold it.** Reading a panel is a reason to keep it.
 *
 * Returns the index plus the props that wire the pause behaviour, so a caller cannot forget
 * half of the contract by spreading only some of it.
 */
export function useAutoCycle(
  count: number,
  { interval = 3200, enabled = true }: { interval?: number; enabled?: boolean } = {},
) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [stopped, setStopped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const running = enabled && !reduced && !stopped && !held && onScreen && count > 1;

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || stopped) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setOnScreen(entry.isIntersecting);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, stopped]);

  useEffect(() => {
    if (!running) return;

    // A background tab keeps firing intervals; it just cannot paint them. Without this the
    // switcher is on slide nine by the time somebody comes back to the tab.
    const onVisibility = () => setHeld(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [running, count, interval]);

  const take = useCallback((next: number) => {
    setStopped(true);
    setIndex(next);
  }, []);

  return {
    index,
    /** The user has taken over: select this index and never advance again. */
    take,
    running,
    containerProps: {
      ref,
      onMouseEnter: () => setHeld(true),
      onMouseLeave: () => setHeld(false),
      onFocusCapture: () => setHeld(true),
      onBlurCapture: () => setHeld(false),
    },
  };
}

/**
 * The gesture a reveal uses.
 *
 * One page repeating one animation twelve times stops reading as motion and starts reading as
 * a tic, so sections vary. The variants are CSS (globals.css, the motion layer); this prop
 * only names one, so no extra JavaScript ships per variant.
 *
 * `mask` wipes instead of fading, which keeps the element fully opaque throughout. That is why
 * it is for visuals and never for text: partial opacity on a paragraph is a contrast failure.
 */
export type RevealVariant = 'rise' | 'left' | 'right' | 'scale' | 'mask' | 'zoom' | 'lines';

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
  variant = 'rise',
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'h1' | 'h2';
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
      data-reveal-variant={variant === 'rise' ? undefined : variant}
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
  variant = 'rise',
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  step?: number;
  max?: number;
  variant?: RevealVariant;
  className?: string;
  as?: 'div' | 'ul' | 'ol';
}) {
  const items = Array.isArray(children) ? children : [children];
  const ItemTag = Tag === 'div' ? 'div' : 'li';

  return (
    <Tag className={className}>
      {items.map((child, index) => (
        <Reveal key={index} delay={Math.min(index, max) * step} variant={variant} as={ItemTag}>
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}

export interface CounterProps {
  value: number;
  from?: number;
  duration?: number;
  format?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

/**
 * Counts once on entering viewport (or smoothly transitions on dynamic value updates).
 *
 * `aria-live` is deliberately absent: a number announced digit by digit as it counts is
 * torture for a screen-reader user. The final value is in the server HTML, so assistive tech
 * and a reader with JS off both get the right number immediately.
 */
export function Counter({
  value,
  from,
  duration: customDuration,
  format,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<number>(value);
  const reduced = useReducedMotion();

  // Read at animation time, not effect-setup time — the value the intersection callback
  // sees must be whichever one is current, not whichever one was current on mount.
  const valueRef = useRef(value);
  valueRef.current = value;
  const fromRef = useRef(from);
  fromRef.current = from;

  const hasAnimatedRef = useRef(false);
  const prevValueRef = useRef<number>(value);
  const frameRef = useRef(0);

  const formatNumber = (n: number) => {
    if (format) return format(n);
    const formatted =
      decimals > 0
        ? n.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : n.toLocaleString('en-IN');
    return `${prefix}${formatted}${suffix}`;
  };

  const runAnimation = useCallback(
    (startVal: number, endVal: number) => {
      cancelAnimationFrame(frameRef.current);
      const diff = Math.abs(endVal - startVal);
      const duration =
        customDuration ??
        Math.min(1000, Math.max(400, 320 + Math.log10(Math.max(diff, 1)) * 180));
      const startTime = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = startVal + (endVal - startVal) * eased;
        setDisplay(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current));
        if (t < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(endVal);
          prevValueRef.current = endVal;
        }
      };
      frameRef.current = requestAnimationFrame(tick);
    },
    [customDuration, decimals],
  );

  /*
   * Set up the observer exactly once per `reduced` state. `hasAnimatedRef` and `valueRef` are
   * refs precisely so that firing them cannot itself change this effect's dependencies —
   * a state-driven "has it fired yet" flag here re-runs this effect the instant it flips,
   * tearing the observer down and cancelling the animation frame it had just scheduled, one
   * microtask before that frame's callback would have run. React Strict Mode's deliberate
   * double-invoke made this reliably reproducible: the counter would settle on whatever the
   * cancelled tick last wrote, not the target value — a permission-key count that lands on
   * the wrong number is worse than one that never animated at all.
   */
  useEffect(() => {
    if (reduced) {
      setDisplay(valueRef.current);
      prevValueRef.current = valueRef.current;
      return;
    }

    const node = ref.current;
    if (!node || hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          hasAnimatedRef.current = true;
          const startNum = fromRef.current ?? 0;
          setDisplay(startNum);
          runAnimation(startNum, valueRef.current);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [reduced, runAnimation]);

  // A value that changes after the reveal (the ROI calculator, a live filter count) gets its
  // own transition; before the reveal, the initial effect above already has the latest value.
  useEffect(() => {
    if (!hasAnimatedRef.current) return;
    if (reduced) {
      setDisplay(value);
      prevValueRef.current = value;
      return;
    }
    if (prevValueRef.current === value) return;
    runAnimation(prevValueRef.current, value);
  }, [value, reduced, runAnimation]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {formatNumber(display)}
    </span>
  );
}

/**
 * A percentage with a fill bar that animate together on scroll into view.
 *
 * Same trigger and easing as `Counter` — one `IntersectionObserver`, one `requestAnimationFrame`
 * loop, reduced motion skips straight to the final width. Kept separate from `Counter` rather
 * than composed from it: the bar's width and the digits must update from the same tick, and
 * threading that back out of `Counter` would mean a callback prop for what is, here, one loop.
 */
export function PercentBar({
  value,
  className,
  trackClassName,
  barClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<number>(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          const startTime = performance.now();
          const duration = Math.min(900, Math.max(400, 320 + Math.log10(Math.max(value, 1)) * 180));
          const tick = (now: number) => {
            const t = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(value * eased));
            if (t < 1) frame = requestAnimationFrame(tick);
            else setDisplay(value);
          };
          setDisplay(0);
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, reduced]);

  return (
    <span ref={ref} className={cn('flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className={cn('hidden h-1.5 w-16 overflow-hidden rounded-full bg-surface-muted sm:block', trackClassName)}
      >
        <span className={cn('block h-full rounded-full bg-viz-1', barClassName)} style={{ width: `${display}%` }} />
      </span>
      <span className="tabular-nums font-medium text-fg">{display}%</span>
    </span>
  );
}
