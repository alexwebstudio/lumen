"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export const ANCHOR_OFFSET = -80;

/** Прокрутка к якорю/элементу/позиции через Lenis (или нативно, если Lenis ещё нет). */
export function scrollToTarget(lenis: Lenis | null, target: string | number | HTMLElement) {
  const reduced = prefersReducedMotion();
  if (lenis) {
    lenis.scrollTo(target, {
      offset: typeof target === "number" ? 0 : ANCHOR_OFFSET,
      duration: 1.2,
      immediate: reduced,
    });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + ANCHOR_OFFSET });
  }
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({ lerp: 0.1, smoothWheel: !prefersReducedMotion() });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => instance.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    // якорные ссылки на странице
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href") ?? "";
      if (hash === "#" || hash === "#top") {
        e.preventDefault();
        instance.scrollTo(0, { duration: 1.2, immediate: prefersReducedMotion() });
        return;
      }
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(instance, target);
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    // пересчёт триггеров после загрузки шрифтов и изображений
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });

    // страховка: снимаем «ожидание JS», если какой-то эффект не смонтировался
    const safety = window.setTimeout(() => document.documentElement.classList.remove("js-wait"), 2500);

    return () => {
      window.clearTimeout(safety);
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      instance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <RouteSync lenis={lenis} />
      {children}
    </LenisContext.Provider>
  );
}

/** Смена страницы (главная ↔ зал): наверх или к якорю, пересчёт Lenis и ScrollTrigger. */
function RouteSync({ lenis }: { lenis: Lenis | null }) {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (!lenis) return;
    if (first.current) {
      // первая загрузка: позицию и якорь восстанавливает браузер
      first.current = false;
      return;
    }
    lenis.resize();
    const hash = window.location.hash;
    const target = hash ? document.querySelector<HTMLElement>(hash) : null;
    if (target) {
      // ждём, пока секции встанут на место, и докручиваем с учётом шапки
      const id = window.setTimeout(() => {
        ScrollTrigger.refresh();
        scrollToTarget(lenis, target);
      }, 120);
      return () => window.clearTimeout(id);
    }
    lenis.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);
  return null;
}
