"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { SplitStagger } from "@/components/motion/SplitStagger";
import type { Trigger } from "@/components/motion/types";

/**
 * Гигантское слово на ширину контейнера: кегль считается через ResizeObserver,
 * без верхнего ограничения в px (300px из ТЗ не даёт слову занять ширину — см. отчёт).
 * maxVw — потолок кегля в vw (для длинных/коротких названий залов).
 */
export function FitWord({
  text,
  as = "div",
  className = "",
  trigger = "scroll",
  delay = 0,
  maxSize = Infinity,
  maxVw,
  align = "center",
}: {
  text: string;
  as?: "h1" | "div" | "p";
  className?: string;
  trigger?: Trigger;
  delay?: number;
  maxSize?: number;
  maxVw?: number;
  align?: "center" | "left";
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const m = measureRef.current;
    if (!box || !m) return;
    const fit = () => {
      const target = box.clientWidth;
      const w = m.getBoundingClientRect().width; // ширина при 100px
      if (!w || !target) return;
      const vwCap = maxVw ? (window.innerWidth * maxVw) / 100 : Infinity;
      setSize(Math.min(maxSize, vwCap, Math.floor(((100 * target) / w) * 100) / 100));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [maxSize, maxVw, text]);

  return (
    <div ref={boxRef} className="relative w-full">
      <span
        ref={measureRef}
        aria-hidden="true"
        className="t-display pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
        style={{ fontSize: 100 }}
      >
        {text}
      </span>
      <SplitStagger
        as={as}
        mode="chars"
        trigger={trigger}
        delay={delay}
        className={`t-display whitespace-nowrap ${align === "left" ? "text-left" : "text-center"} ${className}`}
        style={size ? { fontSize: size } : undefined}
      >
        {text}
      </SplitStagger>
    </div>
  );
}
