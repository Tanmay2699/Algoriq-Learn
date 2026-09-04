'use client';
 
// 'use client': runs the automated code typing animation loop, manages IntersectionObserver, and handles hover-pause state.
 
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from './motion';
 
/**
 * An animated code sample.
 *
 * Automatically types out the code string in a continuous loop with a blinking
 * terminal cursor. Features:
 *  - Automated typing with realistic human/terminal rhythm.
 *  - Pauses upon completion for easy reading before looping.
 *  - Pauses and reveals the full text on hover or keyboard focus so the snippet can be
 *    read, selected, and copied without disruption.
 *  - Zero layout shift: a ghost layout layer reserves the exact dimensions so the
 *    page content never jumps as lines type in.
 *  - Viewport-aware: only animates when scrolled into view via IntersectionObserver.
 *  - Fully accessible (WCAG 2.1.1): maintains tabindex={0}, role="region", and aria-label.
 *  - Honours prefers-reduced-motion: instantly displays static full text.
 */
export function CodeBlock({
  children,
  label,
  surface = 'paper',
  className,
}: {
  children: string;
  /** What the sample shows. Read out before a screen-reader user enters the region. */
  label: string;
  surface?: 'paper' | 'ink';
  className?: string;
}) {
  const [charIndex, setCharIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [mounted, setMounted] = useState(false);
 
  const containerRef = useRef<HTMLPreElement>(null);
  const reduced = useReducedMotion();
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  // Viewport observation: only animate when in view
  useEffect(() => {
    const node = containerRef.current;
    if (!node || reduced) return;
 
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setOnScreen(entry.isIntersecting);
        }
      },
      { threshold: 0.15 },
    );
 
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);
 
  // Tab visibility: pause loop when backgrounded to save CPU/battery
  useEffect(() => {
    const onVisibility = () => {
      setHeld(document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
 
  // Automated typing loop
  useEffect(() => {
    if (!mounted || reduced || !onScreen || held) return;
 
    if (isFading) return;
 
    if (charIndex < children.length) {
      const step = children.length > 250 ? 2 : 1;
      const interval = children.length > 250 ? 16 : 22;
 
      const timeout = window.setTimeout(() => {
        setCharIndex((prev) => Math.min(children.length, prev + step));
      }, interval);
 
      return () => window.clearTimeout(timeout);
    }
 
    // Finished typing: pause for 3.5s so reader can read full snippet, then loop
    const pauseTimeout = window.setTimeout(() => {
      setIsFading(true);
      const resetTimeout = window.setTimeout(() => {
        setCharIndex(0);
        setIsFading(false);
      }, 300);
 
      return () => window.clearTimeout(resetTimeout);
    }, 3500);
 
    return () => window.clearTimeout(pauseTimeout);
  }, [mounted, reduced, onScreen, held, charIndex, isFading, children]);
 
  // On hover/focus or reduced motion or SSR, show the entire text
  const displayedText = !mounted || reduced || held ? children : children.slice(0, charIndex);
 
  return (
    <pre
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label={label}
      className={cn(
        'relative min-w-0 overflow-x-auto rounded-[--radius] border p-4 font-mono text-mk-mono grid grid-cols-1 grid-rows-1',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        surface === 'ink'
          ? 'border-ink-border bg-ink-800 text-on-ink'
          : 'border-border bg-surface-muted text-fg',
        className,
      )}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      {/* Ghost layout reserve: exact dimensions of full text so box never jumps */}
      <span
        aria-hidden="true"
        className="invisible select-none pointer-events-none col-start-1 row-start-1"
      >
        {children}
      </span>
 
      {/* Active typing animation layer */}
      <span
        className={cn(
          'col-start-1 row-start-1 transition-opacity duration-300',
          isFading ? 'opacity-0' : 'opacity-100',
        )}
      >
        <code>{displayedText}</code>
        {mounted && !reduced && (
          <span
            aria-hidden="true"
            className={cn(
              'mk-code-cursor inline-block w-[2px] h-[1.15em] ml-0.5 align-middle bg-current',
              held && 'opacity-0',
            )}
          />
        )}
      </span>
    </pre>
  );
}
