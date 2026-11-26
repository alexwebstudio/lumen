"use client";

// Параметры 4 эффектов AW-Flow. Все компоненты берут их отсюда.
import { gsap, SplitText } from "./gsap";

type Targets = gsap.TweenTarget;

/* 3.1 Split Stagger */
export type SplitMode = "chars" | "words";

export function splitStaggerSet(el: HTMLElement, mode: SplitMode) {
  const split = SplitText.create(el, { type: mode });
  const parts = mode === "chars" ? split.chars : split.words;
  gsap.set(parts, { yPercent: 0, y: 40, rotate: 8, opacity: 0, transformOrigin: "0% 100%" });
  return { split, parts };
}

export function splitStaggerTo(
  split: SplitText,
  parts: Element[],
  mode: SplitMode,
  delay = 0,
) {
  return gsap.to(parts, {
    y: 0,
    rotate: 0,
    opacity: 1,
    duration: 0.7,
    ease: "power2.out",
    stagger: mode === "chars" ? 0.022 : 0.06,
    delay,
    onComplete: () => split.revert(),
  });
}

/* 3.2 Fade Reveal */
export function fadeRevealSet(targets: HTMLElement[]) {
  targets.forEach((t) => t.classList.add("fade-reveal"));
  gsap.set(targets, { maskPosition: "100% 0", webkitMaskPosition: "100% 0", filter: "blur(4px)" });
}

export function fadeRevealTo(targets: HTMLElement[], opts: { delay?: number; stagger?: number } = {}) {
  return gsap.to(targets, {
    maskPosition: "0% 0",
    webkitMaskPosition: "0% 0",
    filter: "blur(0px)",
    duration: 1.3,
    ease: "power1.out",
    delay: opts.delay ?? 0,
    stagger: opts.stagger ?? 0,
    onComplete: () => {
      targets.forEach((t) => t.classList.remove("fade-reveal"));
      gsap.set(targets, { clearProps: "maskPosition,webkitMaskPosition,filter" });
    },
  });
}

/* 3.4 Blur In — у фото: обёртка (opacity + blur), scale у <img data-blur-scale> */
function splitScaleTargets(targets: HTMLElement[]) {
  const imgs: Element[] = [];
  const selfScale: HTMLElement[] = [];
  targets.forEach((t) => {
    const img = t.matches("[data-blur-scale]") ? null : t.querySelector("[data-blur-scale]");
    if (img) imgs.push(img);
    else selfScale.push(t);
  });
  return { imgs, selfScale };
}

export function blurInSet(targets: HTMLElement[]) {
  const { imgs, selfScale } = splitScaleTargets(targets);
  gsap.set(targets, { opacity: 0, filter: "blur(16px)" });
  gsap.set([...selfScale, ...imgs], { scale: 1.05 });
}

export function blurInTo(
  targets: HTMLElement[],
  opts: { delay?: number; stagger?: number; duration?: number } = {},
) {
  const { imgs, selfScale } = splitScaleTargets(targets);
  const vars = {
    duration: opts.duration ?? 0.9,
    ease: "power1.out",
    delay: opts.delay ?? 0,
    stagger: opts.stagger ?? 0,
  };
  const tl = gsap.timeline();
  tl.to(targets, {
    ...vars,
    opacity: 1,
    filter: "blur(0px)",
    onComplete: () => gsap.set(targets, { clearProps: "filter" }),
  }, 0);
  // scale: у обёрток без фото — сами обёртки, у фото — img (с тем же шагом по порядку)
  targets.forEach((t, i) => {
    const own = selfScale.includes(t) ? t : t.querySelector("[data-blur-scale]");
    if (own) tl.to(own, { scale: 1, duration: vars.duration, ease: vars.ease }, vars.delay + i * vars.stagger);
  });
  void imgs;
  return tl;
}

export function asElements(t: Targets): HTMLElement[] {
  return gsap.utils.toArray<HTMLElement>(t);
}
