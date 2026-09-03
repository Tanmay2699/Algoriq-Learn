'use client';

// 'use client': decides whether to autoplay (reduced motion, a pause control) and owns the
// header's hand-off sentinel.

import { useEffect, useRef, useState } from 'react';
import { CTA, Eyebrow, Heading } from '../primitives';
import { useReducedMotion } from '../primitives/motion';
import { site } from '../../config/site';

/**
 * Act I, rebuilt around footage instead of a screenshot.
 *
 * ### What the footage is, and is not
 *
 * It is stock life-of-an-institute b-roll: arrival, the reception desk, a class, an exam, a
 * certificate handed over. It carries no product claim — nobody here is Sunrise Academy,
 * nothing on screen is captured from the running product, and the caption never implies
 * otherwise. That distinction matters on this site specifically: rule 7 is about *product
 * renderings* being real, and roughly eight seconds of this source clip are a fabricated
 * "SCHOOL PORTAL" interface on a tablet, then a laptop, then a phone — a screenshot of
 * software that does not exist, shown as if it were part of an admissions flow. Those seconds
 * are cut. What autoplays here is five unbroken shots and not one frame of invented software.
 * `docs/09-VISUAL-LANGUAGE-AND-ASSETS.md` §10 has the full cut list and the exact timestamps,
 * which are properties of one copy of the master and must be re-derived before a re-encode.
 *
 * ### Motion
 *
 * Autoplay is the one animation on this site that runs for longer than a few hundred
 * milliseconds and asks nothing of the reader first, which is exactly the pattern WCAG 2.2.2
 * exists for. Three things follow from that:
 *
 *  - `preload="none"` in the server HTML, unconditionally. Nobody pays for ~3MB of video
 *    bytes who is not actually going to see it move — not a reduced-motion visitor, not a
 *    crawler, not anyone with JavaScript off.
 *  - Reduced motion never calls `.play()`. The video sits on its poster frame, which is a
 *    perfectly ordinary static hero image, and the toggle below still offers to start it —
 *    the OS setting is "don't start this on me," not "never let me choose to."
 *  - A visible pause control, because autoplaying, looping, silent motion behind text is
 *    still motion somebody may want stopped, and "silent" is not an exemption. It is an icon
 *    alone — no visible caption — but it is still a 44px target and still *named*: the label
 *    moves to `aria-label`, so a screen reader announces "Pause the background video" exactly
 *    as before. Dropping the name with the caption would have made the control unusable
 *    without sight, which is a different decision from making it quieter.
 *
 * ### The header hand-off
 *
 * `hero-video-sentinel` at the bottom of this section is what `SiteHeader` watches to decide
 * whether it is allowed to go transparent. See the long comment on `overHero` there for why
 * that is a second, independent observer rather than a reuse of the page's existing one.
 */
export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    /*
     * `reduced` starts `false` on every render — `useReducedMotion` corrects it a moment
     * later, from its own effect, and that correction is a second render this effect also
     * responds to. A version that only checked `if (reduced) return` at the top acted once on
     * the wrong value and then, on the correction, just returned without undoing what it had
     * already started: reduced motion would call `.play()` on the stale `false`, and the
     * follow-up render would silently skip pausing it. Branching on both states explicitly —
     * pause on `true`, play on `false` — means the correction actually corrects, whichever
     * order these two effects settle in.
     */
    if (reduced) {
      video.pause();
      return;
    }
    video.preload = 'auto';
    // Autoplay can be refused for reasons outside this page's control even when muted; the
    // fallback is simply the poster frame, which is why one exists.
    video.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, [reduced]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.preload = 'auto';
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section aria-labelledby="hero-video-title" className="relative isolate overflow-hidden bg-ink-900 -mt-16">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster="/video/hero-poster.jpg"
        preload="none"
        muted
        loop
        playsInline
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {/* Narrower encode first: a browser that supports both picks the first it can play,
            and a visitor on a small viewport has no reason to decode a 1600-wide frame. */}
        <source src="/video/hero-mobile.webm" type="video/webm" media="(max-width: 767px)" />
        <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/video/hero-desktop.webm" type="video/webm" />
        <source src="/video/hero-desktop.mp4" type="video/mp4" />
      </video>

      <div aria-hidden="true" className="hero-video-scrim absolute inset-0" />

      <div className="container-mk relative flex min-h-svh flex-col justify-end pb-14 pt-28">
        <div className="max-w-2xl">
          <Eyebrow surface="ink" className="mk-enter">
            The institute operating system
          </Eyebrow>
          <Heading
            level={1}
            display="display-1"
            id="hero-video-title"
            surface="ink"
            className="mt-4 mk-lines mk-enter-2"
          >
            <span className="block">From the first enquiry</span>
            <span className="block">to the final certificate.</span>
          </Heading>
          <div className="mk-enter mk-enter-4 mt-8 flex flex-wrap gap-3">
            <CTA href={site.sandboxUrl} size="lg" surface="ink" external>
              Open the live sandbox
            </CTA>
            <CTA href="/demo" variant="secondary" size="lg" surface="ink">
              Book a 20-minute walkthrough
            </CTA>
          </div>
          <p className="mk-enter mk-enter-5 mt-4 max-w-measure text-mk-body-sm text-on-ink-muted">
            No signup for the sandbox. It is a real institute with seeded data, read-only, and
            you can see every role.
          </p>
        </div>
      </div>

      {/*
        WCAG 2.2.2 (Pause, Stop, Hide): required because this is moving content that starts
        on its own and runs longer than five seconds. `aria-pressed` carries the state; the
        label names the action the button is about to take, not the state itself — "Pause
        the background video" reads correctly before a screen reader ever announces
        `pressed`, where "Playing" would not.

        A child of the SECTION, not of `container-mk`. The container is capped at 80rem and
        centred, so a button positioned against it drifts inwards from the video's own corner
        as the viewport grows — on a 1920 screen it sat ~160px short of the edge, which reads
        as a stray control rather than as the video's own. The section is the element that
        actually spans the footage, so it is the one to anchor to. Inset by the gutter token
        on both axes rather than a flat number, so the control keeps step with the page's own
        inline rhythm as the viewport grows.
      */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Pause the background video' : 'Play the background video'}
        className="mk-enter mk-enter-6 absolute bottom-gutter end-gutter z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-border-strong bg-ink-900/40 text-on-ink backdrop-blur-sm transition-colors duration-fast hover:bg-ink-900/60 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false">
          {playing ? (
            <>
              <rect x="7.25" y="5" width="3.5" height="14" rx="1.75" />
              <rect x="13.25" y="5" width="3.5" height="14" rx="1.75" />
            </>
          ) : (
            <path d="M8.5 5.6v12.8a1 1 0 0 0 1.54.84l9.6-6.4a1 1 0 0 0 0-1.68l-9.6-6.4A1 1 0 0 0 8.5 5.6Z" />
          )}
        </svg>
      </button>

      {/*
        See the long comment on `overHero` in `SiteHeader` — this is what it watches.

        `bottom-28` (7rem), not `bottom-0`: the section is `-mt-16 min-h-svh`, so it runs the
        full viewport height, edge to edge, starting from underneath the sticky header rather
        than after it — which means a sentinel at the section's true bottom edge sits exactly
        ON the viewport's own bottom boundary, zero overlap. `IntersectionObserver` reports
        zero overlap as not intersecting, so with the sentinel there the header would never go
        transparent in the first place, not even at the very top of the page. Pulling it up by
        7rem gives it real margin inside the starting viewport on ordinary screen heights, so
        `isIntersecting` starts `true` and only flips once scrolling has actually carried the
        hero's lower edge away — which costs the hand-off a little precision (the header
        solidifies slightly before the very last pixel of video) and buys back correctness at
        the one moment that matters most: first paint.
      */}
      <div id="hero-video-sentinel" aria-hidden="true" className="absolute inset-x-0 bottom-28 h-px" />
    </section>
  );
}
