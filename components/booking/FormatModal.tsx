"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { nbspPrice, pad2 } from "@/lib/format";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { blurInSet, blurInTo } from "@/lib/effects";
import { DashList } from "@/components/ui/DashList";
import { Button } from "@/components/ui/Button";

const t = site.formatModal;

function MiniFaq({ q, a, id }: { q: string; a: string; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left text-[15px]"
      >
        <span>{q}</span>
        <span aria-hidden="true" className="text-[20px] leading-none" style={{ transform: `rotate(${open ? 45 : 0}deg)`, transition: "transform .35s" }}>
          +
        </span>
      </button>
      {open && (
        <p id={id} className="t-body pr-10 pb-4 text-ink-soft">
          {a}
        </p>
      )}
    </li>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-5">
      <h3 className="font-heading text-[13px] font-normal tracking-[.06em] text-ink-soft">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Попап «Подробнее» формата: панель справа (мобайл — снизу), оверлей, Esc, ловушка фокуса. */
export function FormatModal({
  formatId,
  onClosed,
  onBook,
}: {
  formatId: string;
  onClosed: () => void;
  onBook: (options: string[]) => void;
}) {
  const f = site.prices.find((p) => p.id === formatId) ?? site.prices[0];
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);

  const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

  useGSAP(() => {
    if (prefersReducedMotion() || !panelRef.current) return;
    const panel = panelRef.current;
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power1.out" });
    // выезд справа (мобайл — снизу) + Blur In
    gsap.set(panel, isDesktop() ? { xPercent: 100 } : { yPercent: 100 });
    gsap.to(panel, { xPercent: 0, yPercent: 0, duration: 0.6, ease: "power2.out" });
    blurInSet([panel]);
    blurInTo([panel], { duration: 0.9 });
  }, []);

  const finish = useCallback(
    (after?: () => void) => {
      if (closing.current) return;
      closing.current = true;
      const done = () => (after ? after() : onClosed());
      if (prefersReducedMotion() || after) return done();
      gsap.to(panelRef.current, { ...(isDesktop() ? { xPercent: 100 } : { yPercent: 100 }), duration: 0.4, ease: "power2.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: "power1.out", onComplete: done });
    },
    [onClosed],
  );

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        finish();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = "";
      prev?.focus?.({ preventScroll: true });
    };
  }, [finish]);

  const d = f.details;
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end justify-end md:items-stretch"
      style={{ background: "var(--overlay)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      onMouseDown={(e) => e.target === e.currentTarget && finish()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="format-title"
        className="flex h-[100dvh] w-full flex-col bg-bg md:w-[min(640px,100vw)]"
      >
        <div className="flex items-center justify-between px-5 pt-5 md:px-10 md:pt-8">
          <span className="t-small text-ink-soft">{site.pricesSection.title}</span>
          <button ref={closeRef} type="button" onClick={() => finish()} className="t-small -my-2 py-2">
            {site.booking.close}
          </button>
        </div>

        <div data-lenis-prevent="" className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-8 md:px-10">
          <h2 id="format-title" className="t-h2 mt-8">
            {f.title}
          </h2>
          <div className="t-price mt-4">{nbspPrice(f.price)}</div>

          <div className="mt-8 flex flex-col gap-8">
            <Block title={t.forWhom}>
              <p className="t-body">{d.forWhom}</p>
            </Block>
            <Block title={t.includes}>
              <DashList items={d.includes} trigger="load" />
            </Block>
            <Block title={t.process}>
              <ol className="flex flex-col gap-3">
                {d.process.map((s, i) => (
                  <li key={s} className="flex gap-4">
                    <span className="font-num w-7 shrink-0 text-[20px] leading-[1.3]">{pad2(i + 1)}</span>
                    <span className="t-body">{s}</span>
                  </li>
                ))}
              </ol>
            </Block>
            <Block title={t.extra}>
              <DashList items={d.extra} trigger="load" />
            </Block>
            <Block title={t.faq}>
              <ul className="border-t border-line">
                {d.faq.map((item, i) => (
                  <MiniFaq key={item.q} q={item.q} a={item.a} id={`format-faq-${i}`} />
                ))}
              </ul>
            </Block>
          </div>
        </div>

        <div className="border-t border-line bg-bg px-5 py-4 md:px-10 md:py-5">
          <Button className="w-full" onClick={() => finish(() => onBook(f.bookingOptions))}>
            {t.book}
          </Button>
        </div>
      </div>
    </div>
  );
}
