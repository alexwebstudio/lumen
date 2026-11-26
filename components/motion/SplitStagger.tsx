"use client";

import { useRef } from "react";
import { useGSAP, prefersReducedMotion, markReady, onEnter } from "@/lib/gsap";
import { splitStaggerSet, splitStaggerTo, type SplitMode } from "@/lib/effects";
import type { MotionProps } from "./types";

type Props = MotionProps & { mode?: SplitMode };

/** 3.1 Split Stagger — буквы/слова поднимаются каскадом с наклоном. */
export function SplitStagger({
  as: Tag = "div",
  mode = "words",
  trigger = "scroll",
  delay = 0,
  playKey,
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) return markReady(el);
      const { split, parts } = splitStaggerSet(el, mode);
      markReady(el);
      const play = () => splitStaggerTo(split, parts, mode, delay);
      if (trigger === "load") play();
      else onEnter(el, play);
      return () => split.revert();
    },
    { dependencies: [playKey, mode], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} data-anim="" {...rest}>
      {children}
    </Tag>
  );
}
