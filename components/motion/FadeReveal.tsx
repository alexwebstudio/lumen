"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, markReady, onEnter } from "@/lib/gsap";
import { fadeRevealSet, fadeRevealTo } from "@/lib/effects";
import type { MotionProps } from "./types";

type Props = MotionProps & {
  /** если задан — эффект применяется к дочерним элементам по селектору, со stagger */
  childSelector?: string;
  stagger?: number;
};

/** 3.2 Fade Reveal — маска-градиент слева направо + blur 4px → 0. */
export function FadeReveal({
  as: Tag = "div",
  trigger = "scroll",
  delay = 0,
  playKey,
  childSelector,
  stagger = 0.08,
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) return markReady(el);
      const targets = childSelector ? gsap.utils.toArray<HTMLElement>(childSelector, el) : [el];
      if (!targets.length) return markReady(el);
      fadeRevealSet(targets);
      markReady(el);
      const play = () => fadeRevealTo(targets, { delay, stagger: childSelector ? stagger : 0 });
      if (trigger === "load") play();
      else onEnter(el, play);
      return () => targets.forEach((t) => t.classList.remove("fade-reveal"));
    },
    { dependencies: [playKey], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} data-anim="" {...rest}>
      {children}
    </Tag>
  );
}
