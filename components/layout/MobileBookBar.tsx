"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { nbspPrice } from "@/lib/format";
import { useBooking } from "@/components/booking/BookingProvider";

/** <768: плашка брони после hero, скрывается у контактов и подвала. */
export function MobileBookBar() {
  const { open, isOpen } = useBooking();
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const end = [document.getElementById("contacts"), document.getElementById("footer")].filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const ioHero = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    const ioEnd = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setNearEnd(visible.size > 0);
    });
    if (hero) ioHero.observe(hero);
    end.forEach((el) => ioEnd.observe(el));
    return () => {
      ioHero.disconnect();
      ioEnd.disconnect();
    };
  }, []);

  const shown = pastHero && !nearEnd && !isOpen;

  return (
    <button
      type="button"
      onClick={() => open()}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className="fixed right-3 bottom-3 left-3 z-40 flex h-14 items-center justify-between rounded-full bg-ink px-6 text-[13px] tracking-[.08em] text-on-dark md:hidden"
      style={{ transform: shown ? "translateY(0)" : "translateY(150%)", transition: "transform .4s cubic-bezier(.33,1,.68,1)" }}
    >
      <span>{site.ui.mobileBarLabel}</span>
      <span>{nbspPrice(site.ui.mobileBarPrice)}</span>
    </button>
  );
}
