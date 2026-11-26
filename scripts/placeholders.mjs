// Нейтральные плейсхолдеры (цвет --surface темы A) с именем файла по центру.
// Итого 25 фото контента + служебные booking-empty.jpg и og.jpg.
import sharp from "sharp";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const out = "public/images";
const SURFACE = "#C9CDC5";
const LINE = "#BCC1B8";
const INK_SOFT = "#515852";

const list = [
  ["hero.jpg", 2000, 1250],
  ["about.jpg", 2000, 1333],
  ["halls/newyear.jpg", 2000, 1500],
  ["halls/white.jpg", 2000, 1500],
  ["halls/loft.jpg", 2000, 1500],
  ...["portrait", "family", "love", "business"].flatMap((k) => [
    [`works/${k}-1.jpg`, 1500, 2000],
    [`works/${k}-2.jpg`, 2000, 1500],
    [`works/${k}-3.jpg`, 2000, 1500],
  ]),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((i) => [`why/why-${i}.jpg`, 1500, 2000]),
  ["booking-empty.jpg", 1500, 2000],
];

// старые файлы прошлой структуры
for (const old of ["contacts.jpg", "hall-newyear.jpg", "hall-white.jpg", "hall-loft.jpg", "why-1.jpg", "why-2.jpg",
  ...["portrait", "family", "love", "business"].flatMap((k) => [1, 2, 3, 4].map((i) => `works-${k}-${i}.jpg`))]) {
  if (existsSync(`${out}/${old}`)) rmSync(`${out}/${old}`);
}

for (const [name, w, h] of list) {
  mkdirSync(dirname(`${out}/${name}`), { recursive: true });
  const fs = Math.round(Math.min(w, h) / 18);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<rect width="100%" height="100%" fill="${SURFACE}"/>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="none" stroke="${LINE}" stroke-width="2"/>
<text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fs}" fill="${INK_SOFT}" text-anchor="middle" dominant-baseline="middle">${name}</text></svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toFile(`${out}/${name}`);
}
await sharp(`${out}/hero.jpg`).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82 }).toFile(`${out}/og.jpg`);
console.log("готово:", list.length - 1, "фото контента + booking-empty.jpg + og.jpg");
