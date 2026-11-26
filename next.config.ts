import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Фото-исходники небольшие — отдаём с качеством 90 (по умолчанию Next жмёт до 75).
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [90],
    // разрешаем ?v=… у локальных фото (сброс кэша при замене файлов)
    localPatterns: [{ pathname: "/images/**" }],
  },
};

export default nextConfig;
