"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/**
 * Карта с меткой студии. Грузится лениво (когда секция подходит к экрану).
 *
 * Почему Яндекс, а не 2ГИС: публичный JS API 2ГИС (maps.api.2gis.ru/2.0) без ключа
 * загружается, но отдаёт пустые тайлы — улиц не видно. Виджет Яндекса (map-widget)
 * работает без ключа. Кнопка ведёт в 2ГИС (site.contacts.gis2Url).
 * Когда у клиента будет ключ 2ГИС MapGL — заменить iframe на MapGL.
 *
 * Обёртка с data-lenis-prevent; на тач-экранах карта «спит» до первого тапа,
 * чтобы не перехватывать свайп страницы.
 */
export function MapEmbed({ className = "" }: { className?: string }) {
  const c = site.contacts;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { lat, lng } = c.coords;
  const src = `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=${c.mapZoom}&pt=${lng}%2C${lat}%2Cpm2gnm`;

  return (
    <div ref={wrapRef} data-lenis-prevent="" className={`relative overflow-hidden border border-line bg-surface ${className}`}>
      {visible && <iframe title={site.ui.mapTitle} src={src} loading="lazy" className="absolute inset-0 h-full w-full border-0" />}

      {/* тач / узкий экран: карта не перехватывает свайп, пока по ней не тапнули */}
      {locked && (
        <button
          type="button"
          onClick={() => setLocked(false)}
          className="absolute inset-0 z-10 flex items-center justify-center [@media(hover:hover)_and_(min-width:1024px)]:hidden"
        >
          <span className="glass t-small rounded-full px-4 py-2 text-ink">{site.ui.mapHint}</span>
        </button>
      )}

      <a
        href={c.gis2Url}
        target="_blank"
        rel="noopener"
        className="glass btn-link absolute top-3 left-3 z-20 rounded-full border-b-0 px-4 py-2.5 text-ink"
      >
        {site.ui.openIn2gis} →
      </a>
    </div>
  );
}
