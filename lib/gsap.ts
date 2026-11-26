"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Снимает «ожидание JS» с элемента (см. .js-wait в globals.css). */
export function markReady(el: Element | null | undefined) {
  el?.setAttribute("data-anim-ready", "");
}

/** Триггер появления: «top 80%», один раз. */
export function onEnter(trigger: Element, play: () => void) {
  return ScrollTrigger.create({ trigger, start: "top 80%", once: true, onEnter: play });
}
