"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { gsap, useGSAP, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

function FaqRow({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      const vars = { height: open ? "auto" : 0 };
      if (prefersReducedMotion()) gsap.set(panel, vars);
      else gsap.to(panel, { ...vars, duration: 0.5, ease: "power2.out", onComplete: () => ScrollTrigger.refresh() });
    },
    { dependencies: [open] },
  );

  const id = `faq-${i}`;
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[84px] w-full items-center justify-between gap-6 py-4 text-left"
        >
          <span className="font-heading text-[16px] leading-[1.15] md:text-[18px]">{q}</span>
          <span
            aria-hidden="true"
            className="shrink-0 font-sans text-[22px] leading-none"
            style={{ transform: `rotate(${open ? 45 : 0}deg)`, transition: "transform .35s" }}
          >
            +
          </span>
        </button>
      </h3>
      <div
        ref={panelRef}
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className="overflow-hidden"
        style={{ height: 0 }}
        inert={!open}
      >
        <p className="t-body max-w-[60ch] pr-10 pb-7 text-ink-soft md:pr-16">{a}</p>
      </div>
    </li>
  );
}

export function Faq() {
  const { faqSection, faq } = site;
  return (
    <section id="faq" className="section">
      <div className="container-x">
        <div className="grid-x items-start gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:sticky lg:top-[120px] lg:col-start-1 lg:col-end-5">
            <Heading text={faqSection.title} className="t-h2" />
          </div>
          <ul className="col-span-4 border-t border-line md:col-span-8 lg:col-start-6 lg:col-end-13">
            {faq.map((item, i) => (
              <FaqRow key={item.q} q={item.q} a={item.a} i={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
