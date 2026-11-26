// Фото для «Коллекций съёмок»: 4 коллекции × 3 кадра, все — вертикаль 3:4.
// Запуск: node scripts/collections.mjs <папка с фото>
//
// Кроп подобран ВРУЧНУЮ под каждый кадр (никакой автоматики):
//   fy — что срезать по вертикали: 0 = срезать только снизу, 1 = только сверху, 0.5 = поровну;
//   fx — то же по горизонтали (для кадров шире 3:4);
//   extend — кадр в 3:4 не помещается без обрезки человека → не режем, а продолжаем
//            студийный фон по бокам (крайние столбцы пикселей тянутся наружу, без швов).
// Затем апскейл lanczos до 2000px по высоте, лёгкая резкость, JPEG 90.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const src = process.argv[2];
if (!src) throw new Error("Укажите папку с фото");
const out = "public/images/works";
mkdirSync(out, { recursive: true });

const plan = [
  // Портрет и личный бренд (зал «Белый»)
  { name: "portrait-1.jpg", file: "Без названия (21).jpg", fy: 0.8 }, // девушка у стула: срезаем пустой верх
  { name: "portrait-2.jpg", file: "Без названия (22).jpg", fy: 0.85 }, // волосы в движении: голова и ступни целиком
  { name: "portrait-3.jpg", file: "Без названия (23).jpg", fy: 0.76 }, // наклон к стулу 9:16: фигура ~290–1200px, режем пустой верх и низ
  // Семейная и новогодняя (зал «Новогодний»)
  { name: "family-1.jpg", file: "Без названия (24).jpg", fy: 0.95 }, // семья у ёлки: люди целиком (ноги), срезана только макушка ёлки
  { name: "family-2.jpg", file: "Nov 2023.jpg", fx: 0.5 }, // семья на диване: 4:5 → 3:4 по бокам
  { name: "family-3.jpg", file: "Family of three photoshoot photography child studio winter Christmas together baby indoor home.jpg", fy: 0.55 },
  // Love-story (зал «Лофт»)
  { name: "love-1.jpg", file: "Без названия (26).jpg", fy: 1 }, // танец: срезаем пустой верх
  { name: "love-2.jpg", file: "Без названия (25).jpg", fy: 0.5 }, // пара у окон: уже 3:4
  { name: "love-3.jpg", file: "Без названия (27).jpg", fy: 0.5 }, // руки по центру
  // Контент для бизнеса (зал «Белый»)
  { name: "business-1.jpg", file: "Без названия (28).jpg", fy: 0.5 }, // девушка на циклораме
  { name: "business-2.jpg", file: "Без названия (30).jpg", fx: 0.42 }, // телефон и кофе: 4:5 → 3:4
  { name: "business-3.jpg", file: "Без названия (29).jpg", fy: 0.55 }, // в очках на зелёном стуле
];

/** средний цвет полосы шириной 6px у левого и правого края — для дорисовки фона */
async function edgeColor(path, meta) {
  const strip = (left) =>
    sharp(path).extract({ left, top: Math.round(meta.height * 0.1), width: 6, height: Math.round(meta.height * 0.8) }).stats();
  const [l, r] = await Promise.all([strip(0), strip(meta.width - 6)]);
  const ch = (i) => Math.round((l.channels[i].mean + r.channels[i].mean) / 2);
  return { r: ch(0), g: ch(1), b: ch(2) };
}

const LONG = 2000;
for (const p of plan) {
  const path = `${src}/${p.file}`;
  const meta = await sharp(path).metadata();
  const W = meta.width, H = meta.height;
  let buf;
  if (p.extend) {
    const targetW = Math.round((H * 3) / 4);
    const pad = Math.max(0, targetW - W);
    // продолжаем крайние столбцы пикселей — фон студии тянется без швов
    buf = await sharp(path)
      .extend({ left: Math.floor(pad / 2), right: Math.ceil(pad / 2), extendWith: "copy" })
      .toBuffer();
    void edgeColor; // запасной вариант — заливка средним цветом края
  } else if (W / H > 3 / 4) {
    // шире 3:4 → режем по бокам
    const w = Math.round((H * 3) / 4);
    const left = Math.round((W - w) * (p.fx ?? 0.5));
    buf = await sharp(path).extract({ left, top: 0, width: w, height: H }).toBuffer();
  } else {
    // выше 3:4 → режем сверху/снизу
    const h = Math.round((W * 4) / 3);
    const top = Math.round((H - h) * (p.fy ?? 0.5));
    buf = await sharp(path).extract({ left: 0, top, width: W, height: h }).toBuffer();
  }
  const m = await sharp(buf).metadata();
  const k = Math.min(2.6, LONG / m.height);
  await sharp(buf)
    .resize(Math.round(m.width * k), Math.round(m.height * k), { kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.6, m2: 1.2 })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(`${out}/${p.name}`);
  console.log(p.name.padEnd(16), `${W}x${H} →`, `${Math.round(m.width * k)}x${Math.round(m.height * k)}`, p.extend ? "(фон дорисован)" : "");
}
