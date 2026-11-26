"use client";

import { useState } from "react";
import { hallById, site } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { HoverFill } from "@/components/ui/HoverFill";
import { Composition } from "@/components/ui/Composition";
import { BlurIn } from "@/components/motion/BlurIn";

/** Коллекции: список слева + липкая композиция из 3 фото справа. */
export function Works() {
  const { worksSection, works } = site;
  const [active, setActive] = useState(0);
  const current = works[active];

  return (
    <section id="works" className="section">
      <div className="container-x">
        <div className="grid-x">
          <Heading text={worksSection.title} className="t-h2 col-span-4 md:col-span-8 lg:col-start-1 lg:col-end-9" />
        </div>

        {/* мобайл/планшет: чипы */}
        <div
          role="tablist"
          aria-label={worksSection.title}
          className="no-scrollbar after-h2 -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:hidden"
        >
          {works.map((w, i) => (
            <button
              key={w.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="works-composition"
              onClick={() => setActive(i)}
              className={`font-heading h-10 shrink-0 rounded-full border px-4 text-[13px] whitespace-nowrap transition-colors duration-300 ${
                i === active ? "border-ink bg-ink text-bg" : "border-line text-ink-soft"
              }`}
            >
              {w.title}
            </button>
          ))}
        </div>

        <div className="grid-x mt-6 items-start lg:mt-[72px]">
          {/* десктоп: список */}
          <ul role="tablist" aria-label={worksSection.title} className="hidden border-t border-line lg:col-start-1 lg:col-end-6 lg:block">
            {works.map((w, i) => {
              const isActive = i === active;
              return (
                <li key={w.id} className="border-b border-line">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="works-composition"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="hover-fill-host flex h-24 w-full items-center gap-6 text-left"
                  >
                    <span className={`t-num w-12 shrink-0 transition-colors duration-300 ${isActive ? "text-ink" : "text-ink-soft"}`}>
                      {w.num}
                    </span>
                    <span
                      className={`font-heading flex-1 text-[22px] leading-[1.1] transition-colors duration-300 ${
                        isActive ? "text-ink" : "text-ink-soft"
                      }`}
                    >
                      <HoverFill>{w.title}</HoverFill>
                    </span>
                    <span className="t-small hidden shrink-0 text-ink-soft xl:inline">{site.ui.hallLabel(hallById(w.hallId)?.name ?? "")}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <BlurIn
            id="works-composition"
            role="tabpanel"
            className="col-span-4 md:col-span-8 lg:sticky lg:top-[120px] lg:col-start-7 lg:col-end-13"
          >
            <Composition collection={current} />
          </BlurIn>
        </div>
      </div>
    </section>
  );
}
