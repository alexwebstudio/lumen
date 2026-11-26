"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useHallTransition } from "@/lib/transition";

/** Ссылка на страницу зала с перелётом фото (View Transitions). */
export function HallLink({
  hallId,
  children,
  className,
  ariaLabel,
}: {
  hallId: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const go = useHallTransition();
  const href = `/halls/${hallId}`;
  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(href, hallId);
      }}
    >
      {children}
    </Link>
  );
}
