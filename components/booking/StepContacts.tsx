"use client";

import Link from "next/link";
import { site } from "@/content/site";
import { maskPhone } from "@/lib/booking";
import type { BookingState, Field, StepProps } from "./types";

const f = site.booking.form;

export function validateContacts(s: BookingState): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (s.name.trim().length < 2) errors.name = f.errors.name;
  if (s.phone.replace(/\D/g, "").length !== 11) errors.phone = f.errors.phone;
  if (!s.agree) errors.agree = f.errors.agree;
  return errors;
}

type Props = StepProps & {
  showError: (field: Field) => boolean;
  touch: (field: Field) => void;
};

function Error({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="t-small mt-2 text-accent">
      {text}
    </p>
  );
}

const inputCls =
  "h-[52px] w-full border-0 border-b border-ink bg-transparent text-[16px] tracking-[.02em] outline-none focus-visible:border-accent";

export function StepContacts({ s, update, showError, touch }: Props) {
  const errors = validateContacts(s);
  const err = (k: Field) => (showError(k) ? errors[k] : undefined);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="bk-name" className="t-small text-ink-soft">
          {f.name}
        </label>
        <input
          id="bk-name"
          name="name"
          autoComplete="name"
          value={s.name}
          onChange={(e) => update({ name: e.target.value })}
          onBlur={() => touch("name")}
          aria-invalid={!!err("name")}
          aria-describedby={err("name") ? "bk-name-err" : undefined}
          className={inputCls}
        />
        <Error id="bk-name-err" text={err("name")} />
      </div>

      <div>
        <label htmlFor="bk-phone" className="t-small text-ink-soft">
          {f.phone}
        </label>
        <input
          id="bk-phone"
          name="tel"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={f.phonePlaceholder}
          value={s.phone}
          onFocus={() => !s.phone && update({ phone: "+7" })}
          onChange={(e) =>
            update({
              phone: maskPhone(e.target.value, (e.nativeEvent as InputEvent).inputType?.startsWith("delete")),
            })
          }
          onBlur={() => touch("phone")}
          aria-invalid={!!err("phone")}
          aria-describedby={err("phone") ? "bk-phone-err" : undefined}
          className={`${inputCls} placeholder:text-ink-soft/60`}
        />
        <Error id="bk-phone-err" text={err("phone")} />
      </div>

      <div>
        <div id="bk-method" className="t-small text-ink-soft">
          {f.method}
        </div>
        <div role="radiogroup" aria-labelledby="bk-method" className="mt-3 flex flex-wrap gap-2">
          {f.methods.map((m) => {
            const selected = s.method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update({ method: m.id })}
                className={`h-10 rounded-full border px-5 text-[13px] tracking-[.06em] transition-colors duration-300 ${
                  selected ? "border-ink bg-ink text-bg" : "border-line hover:border-ink-soft"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="bk-comment" className="t-small text-ink-soft">
          {f.comment} · {f.commentHint}
        </label>
        <textarea
          id="bk-comment"
          name="comment"
          rows={3}
          value={s.comment}
          onChange={(e) => update({ comment: e.target.value })}
          className="mt-1 w-full resize-none border-0 border-b border-ink bg-transparent py-2 text-[16px] leading-[1.4] tracking-[.02em] outline-none focus-visible:border-accent"
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={s.agree}
            onChange={(e) => update({ agree: e.target.checked })}
            onBlur={() => touch("agree")}
            aria-invalid={!!err("agree")}
            aria-describedby={err("agree") ? "bk-agree-err" : undefined}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={`mt-[1px] flex size-[18px] shrink-0 items-center justify-center border border-ink text-[12px] leading-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent ${
              s.agree ? "border-accent bg-accent text-on-accent" : ""
            }`}
          >
            {s.agree ? "✓" : ""}
          </span>
          <span className="t-small">
            {f.agreePrefix}
            <Link href="/privacy" target="_blank" className="underline underline-offset-2">
              {f.agreeLink}
            </Link>
          </span>
        </label>
        <Error id="bk-agree-err" text={err("agree")} />
      </div>
    </div>
  );
}
