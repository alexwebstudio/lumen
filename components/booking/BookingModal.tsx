"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site, type HallId } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { blurInSet, blurInTo } from "@/lib/effects";
import { isSlotAvailable, calcTotal } from "@/lib/booking";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { FadeReveal } from "@/components/motion/FadeReveal";
import { SummaryBar, SummarySide } from "./Summary";
import { StepHall } from "./StepHall";
import { StepDate } from "./StepDate";
import { StepOptions } from "./StepOptions";
import { StepContacts, validateContacts } from "./StepContacts";
import { StepDone } from "./StepDone";
import type { BookingState, Field } from "./types";

const b = site.booking;
const TOTAL_STEPS = 4;
const DONE = 4;

export function BookingModal({
  initialHall,
  initialOptions,
  onClosed,
}: {
  initialHall?: HallId;
  initialOptions?: string[];
  onClosed: () => void;
}) {
  const [s, setS] = useState<BookingState>({
    hallId: initialHall ?? null,
    date: null,
    time: null,
    duration: 1,
    options: initialOptions ?? [],
    name: "",
    phone: "",
    method: "telegram",
    comment: "",
    agree: false,
  });
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const switching = useRef(false);

  const update = useCallback((patch: Partial<BookingState>) => setS((prev) => ({ ...prev, ...patch })), []);

  /* ── появление: оверлей 0 → 1 (0.3s), панель — Blur In (0.9s) ── */
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power1.out" });
    const panel = panelRef.current ? [panelRef.current] : [];
    blurInSet(panel);
    blurInTo(panel, { duration: 0.9 });
  }, []);

  /* ── закрытие ── */
  const hasContacts = s.name.trim() !== "" || s.phone.replace(/\D/g, "").length > 1;
  const finish = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (prefersReducedMotion()) return onClosed();
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power1.out", onComplete: onClosed });
  }, [onClosed]);

  const requestClose = useCallback(() => {
    if (step !== DONE && hasContacts && !window.confirm(b.confirmClose)) return;
    finish();
  }, [step, hasContacts, finish]);

  /* ── Esc, ловушка фокуса, возврат фокуса ── */
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
      prev?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((n) => n.offsetParent !== null || n.classList.contains("sr-only"));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panelRef.current.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [requestClose]);

  /* ── смена шага: старый контент → opacity 0 (0.2s), новый — Fade Reveal ── */
  const goTo = (next: number) => {
    if (switching.current) return;
    const el = contentRef.current;
    const apply = () => {
      setStep(next);
      if (el) {
        el.scrollTop = 0;
        gsap.set(el, { opacity: 1 });
      }
      switching.current = false;
    };
    if (!el || prefersReducedMotion()) return apply();
    switching.current = true;
    gsap.to(el, { opacity: 0, duration: 0.2, ease: "power1.out", onComplete: apply });
  };

  /* ── валидация ── */
  const slotOk = s.date !== null && s.time !== null && isSlotAvailable(s.date, s.time, s.duration, s.hallId, b.hours);
  const contactErrors = validateContacts(s);
  const valid = [
    s.hallId !== null,
    slotOk,
    slotOk,
    Object.keys(contactErrors).length === 0,
  ][step];

  const submit = async () => {
    setTried(true);
    if (Object.keys(contactErrors).length) return;
    setSending(true);
    setSendError(false);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, total: calcTotal(s.hallId, s.duration, s.options) }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) throw new Error("bad response");
      goTo(DONE);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  const onNext = () => {
    if (step === TOTAL_STEPS - 1) return void submit();
    if (valid) goTo(step + 1);
  };

  const showError = (k: Field) => tried || !!touched[k];
  const touch = (k: Field) => setTouched((t) => ({ ...t, [k]: true }));
  const isDone = step === DONE;
  // на шаге 4 кнопка активна, чтобы по нажатию показать ошибки
  const nextDisabled = sending || (step < TOTAL_STEPS - 1 ? !valid : false);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "var(--overlay)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="flex h-[100dvh] w-full flex-col overflow-hidden bg-bg lg:grid lg:h-[min(760px,calc(100svh-80px))] lg:w-[min(1180px,calc(100vw-80px))] lg:grid-cols-[5fr_7fr]"
      >
        <SummarySide s={s} />
        <SummaryBar s={s} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col px-5 pt-5 pb-4 lg:h-full lg:px-12 lg:pt-10 lg:pb-10">
          {/* шапка */}
          <div className="flex items-center justify-between">
            <span className="t-small text-ink-soft">{b.title}</span>
            <button
              ref={closeRef}
              type="button"
              onClick={isDone ? finish : requestClose}
              className="t-small -my-2 py-2"
            >
              {b.close}
            </button>
          </div>

          {!isDone && (
            <>
              <div className="mt-4 grid grid-cols-4 gap-1.5" aria-hidden="true">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <span
                    key={i}
                    className="h-0.5"
                    style={{ background: i <= step ? "var(--ink)" : "var(--line)", transition: "background .4s" }}
                  />
                ))}
              </div>
              <div className="t-small mt-3 text-ink-soft" aria-live="polite">
                {b.stepOf(step + 1, TOTAL_STEPS)}
              </div>
              {/* key: SplitText при revert() возвращает исходный HTML, поэтому заголовок пересоздаётся на каждом шаге */}
              <Heading
                key={step}
                id="booking-title"
                text={b.steps[step]}
                trigger="load"
                className="font-heading mt-6 text-[28px] leading-[.95] tracking-[-.02em] lg:mt-8 lg:text-[34px]"
              />
            </>
          )}

          <div
            ref={contentRef}
            data-lenis-prevent=""
            className={`no-scrollbar min-h-0 flex-1 overflow-y-auto ${isDone ? "flex flex-col" : "mt-6 lg:mt-7"}`}
          >
            {isDone ? (
              <StepDone onClose={finish} />
            ) : (
              <FadeReveal trigger="load" playKey={step} className="pb-6">
                {step === 0 && <StepHall s={s} update={update} />}
                {step === 1 && <StepDate s={s} update={update} />}
                {step === 2 && <StepOptions s={s} update={update} />}
                {step === 3 && <StepContacts s={s} update={update} showError={showError} touch={touch} />}
              </FadeReveal>
            )}
          </div>

          {!isDone && (
            <div className="border-t border-line pt-4 lg:pt-5">
              {sendError && (
                <p role="alert" className="t-small mb-3 text-accent">
                  {b.sendError}
                </p>
              )}
              <div className="flex items-center gap-3 lg:justify-between">
                {step > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => goTo(step - 1)}
                      aria-label={b.backAria}
                      className="flex size-[52px] shrink-0 items-center justify-center rounded-full border border-line text-[16px] lg:hidden"
                    >
                      ←
                    </button>
                    <Button variant="link" arrow={false} onClick={() => goTo(step - 1)} className="hidden lg:inline-flex">
                      {b.back}
                    </Button>
                  </>
                ) : (
                  <span className="hidden lg:block" />
                )}
                <Button
                  onClick={onNext}
                  disabled={nextDisabled}
                  arrow={step === TOTAL_STEPS - 1 ? "↗" : "→"}
                  className="flex-1 lg:flex-none"
                >
                  {sending ? b.sending : step === TOTAL_STEPS - 1 ? b.submit : b.next}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
