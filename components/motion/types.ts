import type { ElementType, ReactNode, CSSProperties } from "react";

export type Trigger = "scroll" | "load";

export type MotionProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /** «scroll» — при входе во вьюпорт (top 80%), «load» — сразу после монтирования */
  trigger?: Trigger;
  delay?: number;
  /** смена ключа перезапускает эффект (например, смена шага в попапе) */
  playKey?: string | number;
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | boolean | undefined;
  role?: string;
};
