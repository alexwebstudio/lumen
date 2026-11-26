"use client";

import { site } from "@/content/site";
import { formatTenge } from "@/lib/format";
import { isSlotAvailable } from "@/lib/booking";
import type { StepProps } from "./types";

export function StepOptions({ s, update }: StepProps) {
  const b = site.booking;
  const conflict = s.date !== null && s.time !== null && !isSlotAvailable(s.date, s.time, s.duration, s.hallId, b.hours);

  return (
    <div>
      <div id="booking-duration-label" className="sr-only">
        {b.durationLabel}
      </div>
      <div role="radiogroup" aria-labelledby="booking-duration-label" className="grid grid-cols-4 border border-line">
        {b.durations.map((d, i) => {
          const selected = s.duration === d;
          return (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => update({ duration: d })}
              className={`h-[52px] text-[14px] tracking-[.04em] transition-colors duration-300 ${
                i > 0 ? "border-l border-line" : ""
              } ${selected ? "bg-ink text-bg" : "hover:bg-surface"}`}
            >
              {d} {b.summary.hoursShort}
            </button>
          );
        })}
      </div>
      {conflict && (
        <p role="alert" className="t-small mt-3 text-accent">
          {b.durationConflict}
        </p>
      )}

      <div className="t-small mt-8 text-ink-soft">{b.optionsLabel}</div>
      <div className="mt-3 grid grid-cols-2 gap-[10px]">
        {b.options.map((o) => {
          const checked = s.options.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() =>
                update({ options: checked ? s.options.filter((x) => x !== o.id) : [...s.options, o.id] })
              }
              className={`flex h-[88px] items-start justify-between gap-3 border p-4 text-left transition-colors duration-300 ${
                checked ? "border-ink" : "border-line hover:border-ink-soft"
              }`}
            >
              <span className="flex flex-col gap-2">
                <span className="text-[14px] leading-[1.1]">{o.title}</span>
                <span className="t-small text-ink-soft">
                  +{formatTenge(o.price)}
                  {o.perHour ? b.perHourOption : ""}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`flex size-[18px] shrink-0 items-center justify-center border border-ink text-[12px] leading-none ${
                  checked ? "border-accent bg-accent text-on-accent" : ""
                }`}
              >
                {checked ? "✓" : ""}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
