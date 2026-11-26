import type { CSSProperties } from "react";
import { FadeReveal } from "@/components/motion/FadeReveal";
import type { Trigger } from "@/components/motion/types";

/** Список с длинным тире: линия 28×1px, отступ 14px, между строками 10px. */
export function DashList({
  items,
  className = "",
  onDark = false,
  trigger,
}: {
  items: string[];
  className?: string;
  onDark?: boolean;
  trigger?: Trigger;
}) {
  return (
    <FadeReveal
      as="ul"
      childSelector="li"
      stagger={0.08}
      trigger={trigger}
      className={`dash-list t-body ${className}`}
      style={onDark ? ({ "--dash": "var(--on-dark-soft)" } as CSSProperties) : undefined}
    >
      {items.map((item) => (
        <li key={item}>
          <span>{item}</span>
        </li>
      ))}
    </FadeReveal>
  );
}
