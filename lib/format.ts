const NBSP = " ";

/** 12000 → «12 000 ₸» (неразрывные пробелы) */
export function formatTenge(value: number): string {
  const digits = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${digits}${NBSP}₸`;
}

/** Заменяет обычные пробелы вокруг чисел и ₸ на неразрывные. */
export function nbspPrice(text: string): string {
  return text.replace(/(\d) (\d)/g, `$1${NBSP}$2`).replace(/ ₸/g, `${NBSP}₸`);
}

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}
