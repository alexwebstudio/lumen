import Image from "next/image";
import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { BlurIn } from "@/components/motion/BlurIn";
import { FadeReveal } from "@/components/motion/FadeReveal";
import { FitWord } from "@/components/ui/FitWord";
import { HoverFill } from "@/components/ui/HoverFill";
import { BookButton } from "@/components/ui/Button";

/**
 * Hero 1 в 1 по макету docs/hero-reference.jpg (1440×900):
 * фото + 3 затемняющих слоя, LUMEN на ширину контейнера (top 110),
 * подзаголовок, абзац снизу слева, кнопки снизу справа. Весь текст — var(--on-dark).
 */
export function Hero() {
  const { hero } = site;
  return (
    <section
      id="top"
      data-hero-dark=""
      className="relative h-svh min-h-[720px] overflow-hidden text-on-dark"
      style={{ "--hero-pos": hero.imagePositionMobile, "--hero-pos-md": hero.imagePosition } as CSSProperties}
    >
      <BlurIn trigger="load" duration={1.2} className="absolute inset-0 overflow-hidden">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          data-blur-scale=""
          className="content-img object-cover [object-position:var(--hero-pos)] md:[object-position:var(--hero-pos-md)]"
        />
      </BlurIn>

      {/* слои поверх фото (снизу вверх) */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "rgba(16,18,17,.30)" }} />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(16,18,17,.6) 0%, rgba(16,18,17,0) 55%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(0deg, rgba(16,18,17,.55) 0%, rgba(16,18,17,0) 40%)" }}
      />

      {/* LUMEN + подзаголовок */}
      <div className="absolute top-24 md:top-[110px]" style={{ left: "var(--edge)", right: "var(--edge)" }}>
        <FitWord as="h1" text={hero.title} trigger="load" delay={0.15} className="leading-[.82]" />
        <FadeReveal
          as="p"
          trigger="load"
          delay={0.6}
          className="font-heading mt-[18px] text-center text-[15px] leading-[1.1] tracking-[.04em] opacity-85 md:text-[20px]"
        >
          {hero.subtitle}
        </FadeReveal>
      </div>

      {/* Низ. Мобайл: колонка (абзац → Primary → Secondary). ≥768: абзац слева (bottom 50), кнопки справа (bottom 40). */}
      <div className="absolute bottom-5 flex flex-col gap-4 md:hidden" style={{ left: "var(--edge)", right: "var(--edge)" }}>
        <HeroText />
        <HeroButtons />
      </div>
      <div className="absolute bottom-[50px] hidden md:block" style={{ left: "var(--edge)" }}>
        <HeroText />
      </div>
      <div className="absolute bottom-10 hidden md:block" style={{ right: "var(--edge)" }}>
        <HeroButtons />
      </div>
    </section>
  );
}

function HeroText() {
  const { text } = site.hero;
  return (
    <FadeReveal as="p" trigger="load" delay={0.8} className="text-[14px] leading-[1.5] uppercase opacity-90 md:text-[15px]">
      {text[0]}
      <br />
      {text[1]}
    </FadeReveal>
  );
}

function HeroButtons() {
  return (
    <BlurIn trigger="load" delay={0.9} className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-[60px]">
      <a href="#halls" className="font-heading hover-fill-host hit order-2 self-center text-[13px] font-normal tracking-[.06em] uppercase md:order-1">
        <HoverFill>{site.ui.seeHalls}</HoverFill> <span aria-hidden="true">→</span>
      </a>
      {/* Primary на тёмном: фон --on-dark, текст тёмный; hover — --accent */}
      <BookButton variant="inverse" className="order-1 w-full rounded-[26px] md:order-2 md:w-[220px]">
        {site.ui.bookHall}
      </BookButton>
    </BlurIn>
  );
}
