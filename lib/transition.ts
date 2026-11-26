"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { prefersReducedMotion } from "./gsap";

type VTDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => { finished: Promise<void> };
};

export { hallTransitionName } from "./names";

function waitFor(check: () => boolean, timeout = 2500): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      if (check() || performance.now() - start > timeout) return resolve();
      window.setTimeout(tick, 16);
    };
    tick();
  });
}

/**
 * Переход на страницу зала через нативный document.startViewTransition:
 * фото с view-transition-name «hall-<id>» перелетает в hero новой страницы.
 * Без поддержки (Firefox < 144, Safari < 18) или при reduced-motion — обычный переход,
 * фото на странице зала появляется эффектом Blur In.
 */
export function useHallTransition() {
  const router = useRouter();
  return useCallback(
    (href: string, hallId: string) => {
      const doc = document as VTDocument;
      if (!doc.startViewTransition || prefersReducedMotion()) {
        router.push(href);
        return;
      }
      doc.startViewTransition(async () => {
        router.push(href);
        await waitFor(() => !!document.querySelector(`[data-hall-hero="${hallId}"]`));
      });
    },
    [router],
  );
}
