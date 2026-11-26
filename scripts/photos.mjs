// Раскладывает фото из архива «фотки для сайта.zip» по местам из PHOTOS-PINTEREST.md.
// Запуск: node scripts/photos.mjs <папка с распакованными фото>
// Кроп под нужный формат (sharp, стратегия «attention» — по самой содержательной зоне).
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const src = process.argv[2];
if (!src) throw new Error("Укажите папку с фото");
const out = "public/images";

const F = {
  mirror: "Beauty Mirror _ Low Exposure _ Dark Aesthetic.jpg", // гримёрка
  bts: "Behind the scenes bastiaan woudt.jpg", // фотограф за работой
  coffee: "Coffee.jpg", // кофе, кресло
  geometry: "Geometry.jpg", // высокий пролёт, человек
  window: "Inst_ wwvi_ss.jpg", // студия с окном и софтбоксом
  tree: "Без названия (12).jpg", // ёлка + кресло
  whiteModel: "Без названия (14).jpg", // белый зал, модель
  loft: "Без названия (15).jpg", // лофт, окна в пол
  cubes: "Без названия (16).jpg", // кубы на белом
  lights: "Без названия (17).jpg", // свет на стойках
  dog: "Без названия (18).jpg", // собака на стуле
  hall: "Без названия (19).jpg", // пустой зал, окна
  cyc: "Фотостудии с циклорамой в Москве.jpg", // циклорама, горизонталь
};

const V = [3, 4]; // вертикаль
const H43 = [4, 3];
const H32 = [3, 2];
const H169 = [16, 9];

const plan = [
  // hero.jpg — отдельное фото (циклорама с кубами, 2000×1600), скриптом не перезаписывается
  // about.jpg — отдельное фото (кресло + Godox), скриптом не перезаписывается
  ["halls/newyear.jpg", F.tree, null],
  // halls/white.jpg — отдельное фото (арочное окно, белый фон), скриптом не перезаписывается
  ["halls/loft.jpg", F.loft, null],
  // коллекции (works/*) — отдельные фото, см. scripts/collections.mjs
  // «Почему у нас» — по смыслу карточек
  ["why/why-1.jpg", F.lights, V], // Свет уже стоит
  ["why/why-2.jpg", F.cubes, V], // Всё в цене часа
  ["why/why-3.jpg", F.hall, V], // Три зала в одной брони
  ["why/why-4.jpg", F.bts, V], // Фотограф и визажист
  ["why/why-5.jpg", F.mirror, V], // Гримёрка с подсветкой
  ["why/why-6.jpg", F.dog, V], // Можно с детьми и питомцами
  ["why/why-7.jpg", F.geometry, V], // Потолки 4,2 метра
  ["why/why-8.jpg", F.coffee, V], // Парковка и чай
  ["booking-empty.jpg", F.hall, V],
];

// Качество: исходники ~736px. Апскейл lanczos3 до 2000px по длинной стороне (не больше ×2.5)
// + лёгкая резкость + JPEG 90. null — без кропа (кадр целиком, фокус — imagePosition в site.ts).
const LONG = 2000;
for (const [name, file, aspect] of plan) {
  const meta = await sharp(`${src}/${file}`).metadata();
  let w = meta.width, h = meta.height;
  let pipeline = sharp(`${src}/${file}`);
  if (aspect) {
    const [aw, ah] = aspect;
    h = Math.round((meta.width * ah) / aw);
    if (h > meta.height) { h = meta.height; w = Math.round((meta.height * aw) / ah); }
    pipeline = pipeline.resize(w, h, { fit: "cover", position: sharp.strategy.attention });
    pipeline = sharp(await pipeline.toBuffer());
  }
  const k = Math.min(2.5, LONG / Math.max(w, h));
  const W = Math.round(w * k), H = Math.round(h * k);
  mkdirSync(dirname(`${out}/${name}`), { recursive: true });
  await pipeline
    .resize(W, H, { kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.6, m2: 1.2 })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(`${out}/${name}`);
  console.log(name.padEnd(24), `${W}x${H}`, aspect ? "" : "(целиком)", "←", file);
}
// og.jpg собирается из hero.jpg отдельно

