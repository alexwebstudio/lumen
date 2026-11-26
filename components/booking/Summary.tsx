"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { formatTenge, pad2 } from "@/lib/format";
import { calcTotal, getHall, formatDayLong } from "@/lib/booking";
import { PhotoStack } from "@/components/ui/PhotoStack";
import type { BookingState } from "./types";

const t = site.booking.summary;

export function summaryRows(s: BookingState) {
  const opts = site.booking.options.filter((o) => s.options.includes(o.id)).map((o) => o.title);
  return [
    { label: t.date, value: s.date ? formatDayLong(s.date) : t.dash },
    {
      label: t.time,
      value: s.time !== null ? `${pad2(s.time)}:00–${pad2(s.time + s.duration)}:00` : t.dash,
    },
    { label: t.duration, value: s.hallId ? `${s.duration} ${t.hoursShort}` : t.dash },
    { label: t.options, value: opts.length ? opts.join(", ") : t.dash },
  ];
}

function Rows({ s }: { s: BookingState }) {
  return (
    <dl className="flex flex-col gap-1.5">
      {summaryRows(s).map((r) => (
        <div key={r.label} className="t-small flex justify-between gap-4">
          <dt className="text-on-dark-soft">{r.label}</dt>
          <dd className="text-right">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Total({ s }: { s: BookingState }) {
  const total = calcTotal(s.hallId, s.duration, s.options);
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="t-small text-on-dark-soft">{t.total}</span>
      <span className="t-price" aria-live="polite">
        {s.hallId ? formatTenge(total) : t.dash}
      </span>
    </div>
  );
}

/** Десктоп: фото зала на всю высоту колонки + тёмная плашка с итогом. */
export function SummarySide({ s }: { s: BookingState }) {
  const hall = getHall(s.hallId);
  return (
    <aside className="relative hidden h-full overflow-hidden bg-surface lg:block">
      <PhotoStack
        src={hall?.image ?? "/images/booking-empty.jpg"}
        alt={hall?.imageAlt ?? ""}
        sizes="(min-width: 1024px) 40vw, 48px"
        position={hall?.imagePosition}
        duration={0.5}
      />
      <div className="absolute right-5 bottom-5 left-5 bg-dark p-6 text-on-dark">
        <div className="t-h4">{hall ? hall.name : t.empty}</div>
        {hall && (
          <>
            <div className="mt-4">
              <Rows s={s} />
            </div>
            <div className="my-4 h-px bg-line-on-dark" />
            <Total s={s} />
          </>
        )}
      </div>
    </aside>
  );
}

/** Мобайл: свёрнутая плашка 64px сверху, по тапу раскрывается полный итог. */
export function SummaryBar({ s }: { s: BookingState }) {
  const [open, setOpen] = useState(false);
  const hall = getHall(s.hallId);
  const total = calcTotal(s.hallId, s.duration, s.options);
  return (
    <div className="relative z-10 shrink-0 bg-dark text-on-dark lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="booking-summary-full"
        aria-label={t.toggle}
        onClick={() => setOpen((v) => !v)}
        className="flex h-16 w-full items-center gap-3 px-2 pr-5 text-left"
      >
        <span className="relative size-12 shrink-0 overflow-hidden bg-surface">
          <Image
            src={hall?.image ?? "/images/booking-empty.jpg"}
            alt=""
            fill
            sizes="48px"
            className="content-img object-cover"
            style={{ objectPosition: hall?.imagePosition }}
          />
        </span>
        <span className="font-heading flex-1 truncate text-[14px] leading-none">{hall ? hall.name : t.empty}</span>
        <span className="font-num text-[22px] leading-none">{hall ? formatTenge(total) : t.dash}</span>
        <span aria-hidden="true" className="text-[12px]" style={{ transform: `rotate(${open ? 180 : 0}deg)`, transition: "transform .35s" }}>
          ↓
        </span>
      </button>
      {open && (
        <div id="booking-summary-full" className="absolute inset-x-0 top-full border-t border-line-on-dark bg-dark px-5 pt-4 pb-5">
          <Rows s={s} />
          <div className="my-4 h-px bg-line-on-dark" />
          <Total s={s} />
        </div>
      )}
    </div>
  );
}
