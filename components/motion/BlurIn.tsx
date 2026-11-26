"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, markReady, onEnter } from "@/lib/gsap";
import { blurInSet, blurInTo } from "@/lib/effects";
import type { MotionProps } from "./types";

type Props = MotionProps & {
  childSelector?: string;
  stagger?: number;
  duration?: number;
};

/**
 * 3.4 Blur In. Для фото: обёртка (overflow:hidden) получает opacity + blur,
 * а <img data-blur-scale> внутри — scale 1.05 → 1.
 */
export function BlurIn({
  as: Tag = "div",
  trigger = "scroll",
  delay = 0,
  playKey,
  childSelector,
  stagger = 0.08,
  duration,
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
      blurInSet(targets);
      markReady(el);
      const play = () => blurInTo(targets, { delay, stagger: childSelector ? stagger : 0, duration });
      if (trigger === "load") play();
      else onEnter(el, play);
    },
    { dependencies: [playKey], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} data-anim="" {...rest}>
      {children}
    </Tag>
  );
}
