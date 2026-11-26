"use client";

import type { ElementType } from "react";
import { SplitStagger } from "@/components/motion/SplitStagger";
import type { SplitMode } from "@/lib/effects";
import type { Trigger } from "@/components/motion/types";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** false — без анимации (статичный заголовок) */
  animate?: boolean;
  mode?: SplitMode;
  trigger?: Trigger;
  delay?: number;
};

/** Заголовок одним шрифтом (Inter Tight) + Split Stagger. */
export function Heading({ text, as = "h2", className = "t-h2", id, animate = true, mode = "words", trigger, delay }: Props) {
  if (!animate) {
    const Tag = as;
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }
  return (
    <SplitStagger as={as} id={id} className={className} mode={mode} trigger={trigger} delay={delay}>
      {text}
    </SplitStagger>
  );
}
