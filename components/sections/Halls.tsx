import Image from "next/image";
import type { CSSProperties } from "react";
import { HallLink } from "@/components/ui/HallLink";
import { HoverFill } from "@/components/ui/HoverFill";
import { hallTransitionName } from "@/lib/names";
import { site } from "@/content/site";
import { formatTenge } from "@/lib/format";
import { Heading } from "@/components/ui/Heading";
import { DashList } from "@/components/ui/DashList";
import { BookButton } from "@/components/ui/Button";
import { FadeReveal } from "@/components/motion/FadeReveal";
import { BlurIn } from "@/components/motion/BlurIn";
import { SplitStagger } from "@/components/motion/SplitStagger";

export function Halls() {
  const { hallsSection, halls } = site;
  return (
    <section id="halls" className="section">
      <div className="container-x">
        <div className="grid-x gap-y-6">
          <Heading text={hallsSection.title} className="t-h2 col-span-4 md:col-span-8 lg:col-start-1 lg:col-end-8" />
          <FadeReveal
            as="p"
            className="t-body col-span-4 max-w-[46ch] self-end text-ink-soft md:col-span-6 lg:col-start-9 lg:col-end-13"
          >
            {hallsSection.text}
          </FadeReveal>
        </div>

        <div className="after-h2 flex flex-col gap-[72px] lg:gap-[120px]">
          {halls.map((hall, i) => {
            const even = i % 2 === 1;
            return (
              <article key={hall.id} className="grid-x items-start border-t border-line pt-10" aria-labelledby={`hall-${hall.id}`}>
                <BlurIn
                  className={`relative col-span-4 aspect-[4/5] overflow-hidden md:col-span-8 md:aspect-[4/3] ${
                    even ? "lg:col-start-6 lg:col-end-13 lg:order-2" : "lg:col-start-1 lg:col-end-8"
                  }`}
                >
                  <HallLink hallId={hall.id} ariaLabel={hall.name} className="absolute inset-0 block">
                    <span
                      className="absolute inset-0 block overflow-hidden"
                      style={{ viewTransitionName: hallTransitionName(hall.id), viewTransitionClass: "hall-photo" } as CSSProperties}
                    >
                      <Image
                        src={hall.image}
                        alt={hall.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        data-blur-scale=""
                        className="content-img object-cover"
                        style={{ objectPosition: hall.imagePosition }}
                      />
                    </span>
                  </HallLink>
                  {hall.badge && (
                    <span className="font-heading pointer-events-none absolute top-5 left-5 rounded-full bg-accent px-[14px] py-2 text-[12px] leading-[1.45] font-normal tracking-[.06em] text-on-accent uppercase">
                      {hall.badge}
                    </span>
                  )}
                </BlurIn>

                <div
                  className={`col-span-4 mt-8 flex flex-col justify-between gap-10 md:col-span-6 lg:mt-0 lg:self-stretch ${
                    even ? "lg:col-start-1 lg:col-end-5 lg:order-1" : "lg:col-start-9 lg:col-end-13"
                  }`}
                >
                  <div>
                    <div className="t-num text-ink-soft">{hall.num}</div>
                    <h3 id={`hall-${hall.id}`} className="mt-4">
                      <HallLink hallId={hall.id} className="hover-fill-host">
                        <SplitStagger as="span" mode="chars" className="t-h3 block">
                          {hall.name}
                        </SplitStagger>
                      </HallLink>
                    </h3>
                    <FadeReveal as="p" className="t-body mt-5 max-w-[46ch]">
                      {hall.description}
                    </FadeReveal>
                    <DashList items={hall.specs} className="mt-7" />
                  </div>

                  <div>
                    <div className="flex items-baseline">
                      <span className="t-price">{formatTenge(hall.pricePerHour)}</span>
                      <span className="t-small ml-2">{site.ui.perHour}</span>
                    </div>
                    <div className="t-small mt-1 text-ink-soft">{site.ui.minHours(hall.minHours)}</div>
                    <div className="mt-6 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:gap-7 lg:flex-col lg:items-start lg:gap-5">
                      <BookButton hallId={hall.id} className="w-full sm:w-auto">
                        {site.ui.bookThisHall}
                      </BookButton>
                      <HallLink hallId={hall.id} className="btn-link hover-fill-host self-center sm:self-auto lg:self-start">
                        <HoverFill>{site.ui.hallDetails}</HoverFill>
                        <span aria-hidden="true">→</span>
                      </HallLink>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
