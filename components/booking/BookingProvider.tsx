"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLenis } from "@/components/motion/SmoothScroll";
import type { HallId } from "@/content/site";

const BookingModal = dynamic(() => import("./BookingModal").then((m) => m.BookingModal), { ssr: false });
const FormatModal = dynamic(() => import("./FormatModal").then((m) => m.FormatModal), { ssr: false });

type OpenOptions = { options?: string[] };

type BookingCtx = {
  /** попап брони; hallId — предвыбор зала, options — отмеченные опции */
  open: (hallId?: HallId, opts?: OpenOptions) => void;
  close: () => void;
  /** попап «Подробнее» формата из блока «Форматы и цены» */
  openFormat: (formatId: string) => void;
  isOpen: boolean;
};

const Ctx = createContext<BookingCtx>({ open: () => {}, close: () => {}, openFormat: () => {}, isOpen: false });

export function useBooking() {
  return useContext(Ctx);
}

type State =
  | { kind: "none"; key: number }
  | { kind: "booking"; key: number; hallId?: HallId; options?: string[] }
  | { kind: "format"; key: number; formatId: string };

export function BookingProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const [state, setState] = useState<State>({ kind: "none", key: 0 });

  const open = useCallback((hallId?: HallId, opts?: OpenOptions) => {
    setState((s) => ({ kind: "booking", hallId, options: opts?.options, key: s.key + 1 }));
  }, []);
  const openFormat = useCallback((formatId: string) => {
    setState((s) => ({ kind: "format", formatId, key: s.key + 1 }));
  }, []);
  const close = useCallback(() => setState((s) => ({ kind: "none", key: s.key })), []);

  const isOpen = state.kind !== "none";
  useEffect(() => {
    if (!lenis) return;
    if (isOpen) lenis.stop();
    else lenis.start();
  }, [isOpen, lenis]);

  const value = useMemo(() => ({ open, close, openFormat, isOpen }), [open, close, openFormat, isOpen]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {state.kind === "booking" && (
        <BookingModal key={state.key} initialHall={state.hallId} initialOptions={state.options} onClosed={close} />
      )}
      {state.kind === "format" && (
        <FormatModal
          key={state.key}
          formatId={state.formatId}
          onClosed={close}
          onBook={(options) => open(undefined, { options })}
        />
      )}
    </Ctx.Provider>
  );
}
