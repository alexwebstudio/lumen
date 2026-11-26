"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { HoverFill } from "@/components/ui/HoverFill";
import { useBooking } from "@/components/booking/BookingProvider";
import { useLenis } from "@/components/motion/SmoothScroll";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { blurInSet, blurInTo } from "@/lib/effects";
import { MobileMenuPanel } from "./MobileMenu";

export function Logo({ href = "#top" }: { href?: string }) {
  const cls = "hit font-heading inline-flex items-baseline gap-1 text-[18px] leading-none font-normal tracking-[.08em]";
  const inner = (
    <>
      <span>{site.brand.name}</span>
      <span aria-hidden="true" className="inline-block size-[6px] rounded-full bg-accent" />
    </>
  );
  return href.startsWith("/") ? (
    <Link href={href} aria-label={site.ui.homeLabel} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} aria-label={site.ui.homeLabel} className={cls}>
      {inner}
    </a>
  );
}

/** Какая секция сейчас в зоне видимости (для точки под пунктом меню). */
function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids, enabled]);
  return active;
}

const NAV_IDS = site.nav.map((n) => n.href.slice(1));
const SCROLL_GLASS = 80;

type Mode = "top" | "glass" | "compact" | "panel";

/**
 * Шапка — ОДИН элемент, который морфится между состояниями (GSAP, 0.5s, power2.out, обратимо):
 *  top     — наверху: без фона и рамки, на ширину контейнера, высота 80 (мобайл 64), кнопки нет;
 *  glass   — после 80px скролла: стеклянная карточка 1080×64, radius 20, кнопка «Забронировать»;
 *  compact — скролл вниз: карточка чуть уже (1020×60), при скролле вверх — обратно в glass;
 *  panel   — мобайл: карточка разворачивается в панель меню.
 */
function targetFor(mode: Mode, desktop: boolean, cw: number, vh: number) {
  if (desktop) {
    if (mode === "top") return { top: 0, width: Math.min(1440, cw), height: 80, borderRadius: 0, glass: 0, padL: 40, padR: 40, btn: 0 };
    if (mode === "compact") return { top: 16, width: Math.min(1020, cw - 48), height: 60, borderRadius: 20, glass: 1, padL: 24, padR: 10, btn: 1 };
    return { top: 16, width: Math.min(1080, cw - 48), height: 64, borderRadius: 20, glass: 1, padL: 24, padR: 10, btn: 1 };
  }
  if (mode === "panel") return { top: 12, width: cw - 24, height: Math.min(640, vh - 24), borderRadius: 24, glass: 1, padL: 20, padR: 10, btn: 0 };
  if (mode === "top") return { top: 8, width: cw, height: 56, borderRadius: 0, glass: 0, padL: 20, padR: 12, btn: 0 };
  return { top: 12, width: cw - 24, height: 56, borderRadius: 18, glass: 1, padL: 20, padR: 10, btn: 0 };
}

export function Header({ homeHref = "" }: { homeHref?: string }) {
  const onHome = homeHref === "";
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const [menu, setMenu] = useState<"closed" | "open" | "closing">("closed");
  const [ready, setReady] = useState(false);
  const lastY = useRef(0);
  const cardRef = useRef<HTMLElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { open: openBooking } = useBooking();
  const lenis = useLenis();
  const active = useActiveSection(NAV_IDS, onHome);

  // скролл: состояние стекла, сжатие по направлению, цвет текста по низу тёмного hero
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero-dark]");
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y >= SCROLL_GLASS);
      if (y > 200 && y > lastY.current + 2) setCompact(true);
      else if (y < lastY.current - 2 || y <= 200) setCompact(false);
      lastY.current = y;
      // над тёмным hero — светлый текст, ниже — тёмный
      setOverDark(!!hero && hero.getBoundingClientRect().bottom > 48);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const mode: Mode = menu === "open" ? "panel" : !scrolled && menu === "closed" ? "top" : compact ? "compact" : "glass";

  // морф между состояниями
  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const cw = document.documentElement.clientWidth;
      const t = targetFor(mode, desktop, cw, window.innerHeight);
      const dur = !ready || prefersReducedMotion() ? 0 : 0.5;
      const ease = "power2.out";
      gsap.to(card, { top: t.top, width: t.width, height: t.height, borderRadius: t.borderRadius, duration: dur, ease, overwrite: "auto" });
      gsap.to(glassRef.current, { opacity: t.glass, duration: dur, ease, overwrite: "auto" });
      gsap.to(rowRef.current, { paddingLeft: t.padL, paddingRight: t.padR, duration: dur, ease, overwrite: "auto" });
      gsap.to(btnRef.current, { opacity: t.btn, scale: t.btn ? 1 : 0.9, duration: dur, ease, overwrite: "auto" });

      if (menu === "open" && dur) {
        const items = gsap.utils.toArray<HTMLElement>("[data-menu-item]", card);
        blurInSet(items);
        blurInTo(items, { stagger: 0.05, delay: 0.1 });
      }
      if (menu === "closing") {
        gsap.delayedCall(dur, () => setMenu("closed"));
      }
      if (!ready) setReady(true);
    },
    { dependencies: [mode, menu] },
  );

  // пересчёт размеров при ресайзе
  useEffect(() => {
    const onResize = () => {
      const card = cardRef.current;
      if (!card) return;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const t = targetFor(mode, desktop, document.documentElement.clientWidth, window.innerHeight);
      gsap.set(card, { top: t.top, width: t.width, height: t.height, borderRadius: t.borderRadius });
      gsap.set(rowRef.current, { paddingLeft: t.padL, paddingRight: t.padR });
      if (desktop && menu !== "closed") setMenu("closed");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mode, menu]);

  const closeMenu = useCallback(() => setMenu((m) => (m === "open" ? "closing" : m)), []);

  // Lenis, Esc, фокус в открытой мобильной панели
  useEffect(() => {
    if (menu !== "open") return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
      if (e.key === "Tab" && cardRef.current) {
        const f = cardRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [menu, lenis, closeMenu]);

  // цвет текста: в состоянии «наверху» и над тёмным hero — светлый, ниже hero — тёмный
  const light = overDark && menu === "closed";
  const btnVisible = mode === "glass" || mode === "compact";

  return (
    <>
      {/* затемнение под мобильной панелью */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          background: "var(--menu-dim)",
          opacity: menu === "open" ? 1 : 0,
          pointerEvents: menu === "open" ? "auto" : "none",
          transition: "opacity .4s",
        }}
      />

      <header
        ref={cardRef}
        className="fixed top-2 left-1/2 z-50 h-14 w-full -translate-x-1/2 lg:top-0 overflow-hidden lg:h-20 lg:w-[min(1440px,100%)]"
        style={{ color: light ? "var(--on-dark)" : "var(--ink)", transition: "color .3s" }}
      >
        {/* стекло — отдельный слой, проявляется при морфе */}
        <div ref={glassRef} aria-hidden="true" className="glass pointer-events-none absolute inset-0" style={{ opacity: 0, borderRadius: "inherit" }} />

        <div ref={rowRef} className="relative flex h-14 items-center justify-between px-5 lg:h-full lg:px-10">
          <Logo href={onHome ? "#top" : "/"} />

          <nav aria-label={site.ui.menu} className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <ul className="flex gap-12">
              {site.nav.map((item) => {
                const id = item.href.slice(1);
                const isActive = onHome && active === id;
                return (
                  <li key={item.href} className="relative">
                    <a href={`${homeHref}${item.href}`} className="t-nav hover-fill-host" aria-current={isActive ? "true" : undefined}>
                      <HoverFill>{item.label}</HoverFill>
                    </a>
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-2.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent"
                      style={{ opacity: isActive ? 1 : 0, transition: "opacity .3s" }}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            ref={btnRef}
            type="button"
            onClick={() => openBooking()}
            tabIndex={btnVisible ? 0 : -1}
            aria-hidden={!btnVisible}
            className="btn btn--primary hidden h-11 rounded-[14px] px-5 lg:inline-flex"
            style={{ opacity: 0, pointerEvents: btnVisible ? "auto" : "none" }}
          >
            <span>{site.ui.book}</span>
            <span className="btn__arrow" aria-hidden="true">
              ↗
            </span>
          </button>

          <button
            ref={toggleRef}
            type="button"
            className="font-heading flex h-11 items-center gap-3 px-2.5 text-[13px] font-normal tracking-[.06em] lg:hidden"
            aria-expanded={menu === "open"}
            aria-controls="mobile-menu"
            onClick={() => (menu === "open" ? closeMenu() : setMenu("open"))}
          >
            <span>{menu === "open" ? site.ui.close : site.ui.menu}</span>
            <span aria-hidden="true" className="relative block h-[6px] w-5">
              <span
                className="absolute top-0 left-0 h-px w-5 bg-current transition-transform duration-300"
                style={{ transform: menu === "open" ? "translateY(2.5px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-300"
                style={{ transform: menu === "open" ? "translateY(-2.5px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>

        {menu !== "closed" && <MobileMenuPanel homeHref={homeHref} onClose={closeMenu} />}
      </header>
    </>
  );
}
