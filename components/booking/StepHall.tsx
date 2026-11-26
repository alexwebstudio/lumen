"use client";

import Image from "next/image";
import { site } from "@/content/site";
import { formatTenge } from "@/lib/format";
import { isSlotAvailable } from "@/lib/booking";
import type { StepProps } from "./types";

export function StepHall({ s, update }: StepProps) {
  const b = site.booking;
  return (
    <div role="radiogroup" aria-labelledby="booking-title" className="flex flex-col gap-3">
      {site.halls.map((hall) => {
        const selected = s.hallId === hall.id;
        return (
          <button
            key={hall.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => {
              const patch: Parameters<typeof update>[0] = { hallId: hall.id };
              // при смене зала сбрасываем время, если оно занято в новом зале
              if (s.date && s.time !== null && !isSlotAvailable(s.date, s.time, s.duration, hall.id, b.hours)) {
                patch.time = null;
              }
              update(patch);
            }}
            className={`grid h-[104px] grid-cols-[80px_1fr_auto] items-center gap-3 border p-3 text-left transition-colors duration-300 md:h-[120px] md:grid-cols-[120px_1fr_auto] md:gap-4 ${
              selected ? "border-ink bg-accent-soft" : "border-line hover:border-ink-soft"
            }`}
            style={selected ? { boxShadow: "inset 3px 0 0 var(--accent)" } : undefined}
          >
            <span className="relative size-20 overflow-hidden bg-surface md:size-24">
              <Image src={hall.image} alt="" fill sizes="96px" className="content-img object-cover" style={{ objectPosition: hall.imagePosition }} />
            </span>
            <span className="flex min-w-0 flex-col gap-2">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-[16px] leading-[1.1] md:text-[18px]">{hall.name}</span>
                {hall.badge && (
                  <span className="rounded-full bg-accent px-2 py-1 text-[12px] leading-none tracking-[.06em] text-on-accent">
                    {b.seasonBadge}
                  </span>
                )}
              </span>
              <span className="t-small text-ink-soft">{hall.short}</span>
            </span>
            <span className="flex flex-col items-end gap-1 pr-1">
              <span className="font-num text-[18px] leading-none whitespace-nowrap md:text-[22px]">
                {formatTenge(hall.pricePerHour)}
              </span>
              <span className="t-small">{b.perHourShort}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
