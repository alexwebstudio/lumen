"use client";

import { useMemo } from "react";
import { site } from "@/content/site";
import { pad2 } from "@/lib/format";
import { getDays, isSlotAvailable } from "@/lib/booking";
import type { StepProps } from "./types";

export function StepDate({ s, update }: StepProps) {
  const b = site.booking;
  const days = useMemo(() => getDays(b.days), [b.days]);

  return (
    <div>
      <div
        role="radiogroup"
        aria-labelledby="booking-title"
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0"
      >
        {days.map(({ key, date }) => {
          const selected = s.date === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${date.getDate()} ${b.months[date.getMonth()]}, ${b.weekdays[date.getDay()]}`}
              onClick={() => update({ date: key, time: null })}
              className={`flex h-[76px] w-16 shrink-0 flex-col items-center justify-between border py-3 transition-colors duration-300 ${
                selected ? "border-ink bg-ink text-bg" : "border-line hover:border-ink-soft"
              }`}
            >
              <span className="t-small">{b.weekdays[date.getDay()]}</span>
              <span className="font-num text-[24px] leading-none">{date.getDate()}</span>
            </button>
          );
        })}
      </div>

      {s.date && (
        <div className="mt-7">
          <div id="booking-time-label" className="t-small text-ink-soft">
            {b.timeLabel}
          </div>
          <div role="radiogroup" aria-labelledby="booking-time-label" className="mt-3 grid grid-cols-4 gap-2">
            {b.hours.map((h) => {
              const available = isSlotAvailable(s.date!, h, s.duration, s.hallId, b.hours);
              const selected = s.time === h;
              return (
                <button
                  key={h}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={!available}
                  onClick={() => update({ time: h })}
                  className={`h-12 border text-[14px] tracking-[.04em] transition-colors duration-300 ${
                    selected
                      ? "border-ink bg-ink text-bg"
                      : available
                        ? "border-line hover:border-ink-soft"
                        : "cursor-not-allowed border-line text-ink-soft line-through opacity-40"
                  }`}
                >
                  {pad2(h)}:00
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
