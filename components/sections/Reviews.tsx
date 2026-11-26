"use client";

import { useRef } from "react";
import { site, type Review } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { HoverFill } from "@/components/ui/HoverFill";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const SPEED = 40; // px/с

function Stars() {
  return (
    <span className="flex gap-0.5 text-accent" role="img" aria-label={site.ui.starsLabel}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

function Card({ r, hidden }: { r: Review; hidden?: boolean }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className="flex h-[260px] w-[290px] shrink-0 flex-col bg-surface p-7 md:w-[380px]"
    >
      <div className="flex items-center justify-between">
        <Stars />
        <span className="t-small text-ink-soft">{site.ui.reviewsSource}</span>
      </div>
      <blockquote className="clamp-5 mt-4 text-[15px] leading-[1.6]">{r.text}</blockquote>
      <figcaption className="mt-auto pt-4">
        <div className="font-heading text-[15px] leading-[1.1] font-normal">{r.name}</div>
        <div className="mt-1 text-[13px] text-ink-soft">{r.format}</div>
      </figcaption>
    </figure>
  );
}

/** Бесконечная лента отзывов: список продублирован, translateX 0 → −50%, ~40px/с. */
export function Reviews() {
  const { reviewsSection, reviews, contacts } = site;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const vp = viewportRef.current;
      if (!track || !vp) return;
      if (prefersReducedMotion()) {
        vp.classList.add("overflow-x-auto");
        return;
      }
      const build = () => {
        tween.current?.kill();
        gsap.set(track, { xPercent: 0 });
        const half = track.scrollWidth / 2;
        tween.current = gsap.to(track, { xPercent: -50, duration: half / SPEED, ease: "none", repeat: -1 });
      };
      build();
      let w = window.innerWidth;
      const onResize = () => {
        if (Math.abs(window.innerWidth - w) < 2) return;
        w = window.innerWidth;
        build();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: viewportRef },
  );

  const pause = () => tween.current && gsap.to(tween.current, { timeScale: 0, duration: 0.4, overwrite: true });
  const play = () => tween.current && gsap.to(tween.current, { timeScale: 1, duration: 0.4, overwrite: true });

  return (
    <section id="reviews" className="section overflow-x-clip">
      <div className="container-x">
        <div className="grid-x gap-y-6">
          <Heading text={reviewsSection.title} className="t-h2 col-span-4 md:col-span-6 lg:col-start-1 lg:col-end-9" />
          <a
            href={contacts.gis2Url}
            target="_blank"
            rel="noopener"
            className="font-heading hover-fill-host col-span-4 self-end text-[13px] font-normal md:col-span-2 md:justify-self-end lg:col-start-10 lg:col-end-13"
          >
            <HoverFill>{reviewsSection.ratingLink}</HoverFill>
          </a>
        </div>
      </div>

      {/* full-bleed лента с растворяющимися краями */}
      <div
        ref={viewportRef}
        className="after-h2 no-scrollbar [--fade-a:6%] [--fade-b:94%] md:[--fade-a:12%] md:[--fade-b:88%]"
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent 0, black var(--fade-a), black var(--fade-b), transparent 100%)",
          maskImage: "linear-gradient(90deg, transparent 0, black var(--fade-a), black var(--fade-b), transparent 100%)",
        }}
        onMouseEnter={pause}
        onMouseLeave={play}
        onTouchStart={pause}
        onTouchEnd={play}
        onTouchCancel={play}
        onFocus={pause}
        onBlur={play}
      >
        <div ref={trackRef} className="flex w-max gap-4 pr-4 will-change-transform">
          {reviews.map((r) => (
            <Card key={r.name} r={r} />
          ))}
          {reviews.map((r) => (
            <Card key={`${r.name}-dup`} r={r} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}
