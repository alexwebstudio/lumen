import { NextResponse } from "next/server";
import { site } from "@/content/site";
import { calcTotal } from "@/lib/booking";

type Body = {
  hallId?: unknown;
  date?: unknown;
  time?: unknown;
  duration?: unknown;
  options?: unknown;
  name?: unknown;
  phone?: unknown;
  method?: unknown;
  comment?: unknown;
  agree?: unknown;
};

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const hall = site.halls.find((h) => h.id === body.hallId);
  const date = str(body.date, 10);
  const time = typeof body.time === "number" ? body.time : NaN;
  const duration = typeof body.duration === "number" ? body.duration : NaN;
  const optionIds = Array.isArray(body.options)
    ? body.options.filter((o): o is string => typeof o === "string" && site.booking.options.some((x) => x.id === o))
    : [];
  const name = str(body.name, 100);
  const phone = str(body.phone, 30);
  const method = site.booking.form.methods.find((m) => m.id === body.method)?.id;

  const errors: string[] = [];
  if (!hall) errors.push("hallId");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("date");
  if (!site.booking.hours.includes(time)) errors.push("time");
  if (!site.booking.durations.includes(duration)) errors.push("duration");
  if (name.length < 2) errors.push("name");
  if (phone.replace(/\D/g, "").length !== 11) errors.push("phone");
  if (!method) errors.push("method");
  if (body.agree !== true) errors.push("agree");

  if (errors.length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const booking = {
    hall: hall!.name,
    date,
    time,
    duration,
    options: optionIds,
    total: calcTotal(hall!.id, duration, optionIds), // пересчитываем на сервере, не доверяем клиенту
    name,
    phone,
    method,
    comment: str(body.comment, 1000),
    createdAt: new Date().toISOString(),
  };

  // TODO: Telegram Bot API — токен и chat_id из env
  // (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID → POST https://api.telegram.org/bot<token>/sendMessage)
  console.log("[booking]", booking);

  return NextResponse.json({ ok: true });
}
