import { site, type BookingOption, type Hall, type HallId } from "@/content/site";

export function getHall(id: HallId | null | undefined): Hall | undefined {
  return site.halls.find((h) => h.id === id);
}

export function calcTotal(hallId: HallId | null, hours: number, optionIds: string[]): number {
  const hall = getHall(hallId);
  if (!hall) return 0;
  const options = site.booking.options as BookingOption[];
  const extras = options
    .filter((o) => optionIds.includes(o.id))
    .reduce((sum, o) => sum + (o.perHour ? o.price * hours : o.price), 0);
  return hall.pricePerHour * hours + extras;
}

/** Дни ленты: сегодня + (days - 1). Ключ — YYYY-MM-DD в локальном времени. */
export function getDays(count: number): { key: string; date: Date }[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    return { key: dateKey(d), date: d };
  });
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Демо-занятость: детерминированно от даты, зала и часа, ~30 %. */
export function isBusy(day: string, hour: number, hallId: HallId | null): boolean {
  const seed = `${day}|${hallId ?? ""}|${hour}`;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100) < 30;
}

/** Слот доступен, только если свободны все часы длительности и бронь укладывается в рабочий день. */
export function isSlotAvailable(
  day: string,
  start: number,
  duration: number,
  hallId: HallId | null,
  hours: number[],
): boolean {
  const last = hours[hours.length - 1];
  if (start + duration - 1 > last) return false;
  if (isPastHour(day, start)) return false;
  for (let h = start; h < start + duration; h++) {
    if (isBusy(day, h, hallId)) return false;
  }
  return true;
}

export function phoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Маска +7 (___) ___-__-__ */
export function maskPhone(input: string, deleting = false): string {
  const raw = input.trim();
  let r: string;
  if (raw.startsWith("+7")) {
    r = phoneDigits(raw.slice(2));
    if (r.startsWith("8")) r = r.slice(1); // «+7» + набранная по привычке 8
  } else {
    r = phoneDigits(raw);
    if (r.length === 11 || r.startsWith("8")) r = r.slice(1); // 8 700… или 7 700… (11 цифр)
  }
  r = r.slice(0, 10);
  let out = "+7";
  if (r.length > 0) out += " (" + r.slice(0, 3);
  if (r.length >= 3) out += ")";
  if (r.length > 3) out += " " + r.slice(3, 6);
  if (r.length > 6) out += "-" + r.slice(6, 8);
  if (r.length > 8) out += "-" + r.slice(8, 10);
  // при удалении не дописываем скобку/разделитель обратно
  return deleting ? out.replace(/[^\d]+$/, "") : out;
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** «12 ДЕК, ПТ» */
export function formatDayLong(key: string): string {
  const d = parseKey(key);
  const { months, weekdays } = site.booking;
  return `${d.getDate()} ${months[d.getMonth()]}, ${weekdays[d.getDay()]}`;
}

/** Час уже прошёл (для сегодняшнего дня). */
export function isPastHour(key: string, hour: number): boolean {
  const now = new Date();
  return key === dateKey(now) && hour <= now.getHours();
}
