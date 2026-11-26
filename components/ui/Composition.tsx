"use client";

import Link from "next/link";
import { hallById, site, type Collection } from "@/content/site";
import { PhotoStack } from "./PhotoStack";
import { HoverFill } from "./HoverFill";

/**
 * Композиция из 3 вертикальных фото 3:4: слева большое (2/3 ширины), справа два друг над другом (1/3).
 * При ширинах 2:1 высота двух малых кадров совпадает с большим, поэтому все кадры остаются вертикальными
 * и люди в полный рост не режутся. Кроп каждого файла подобран вручную — scripts/collections.mjs.
 * Мобайл: большое сверху, два снизу в ряд. Смена коллекции — кроссфейд с Blur In (0.6s).
 */
export function Composition({ collection, showCaption = true }: { collection: Collection; showCaption?: boolean }) {
  const hall = hallById(collection.hallId);
  const [a, b, c] = collection.images;
  const alt = (n: number) => `${collection.title} — ${n}`;
  return (
    <figure>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-[2fr_1fr]">
        <div className="relative col-span-2 aspect-[3/4] overflow-hidden bg-surface md:col-span-1">
          <PhotoStack src={a} alt={alt(1)} sizes="(min-width: 1024px) 34vw, (min-width: 768px) 62vw, 100vw" />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-3 md:col-span-1 md:grid-cols-1 md:grid-rows-2">
          <div className="relative aspect-[3/4] overflow-hidden bg-surface md:aspect-auto">
            <PhotoStack src={b} alt={alt(2)} sizes="(min-width: 1024px) 17vw, (min-width: 768px) 31vw, 50vw" />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden bg-surface md:aspect-auto">
            <PhotoStack src={c} alt={alt(3)} sizes="(min-width: 1024px) 17vw, (min-width: 768px) 31vw, 50vw" />
          </div>
        </div>
      </div>
      {showCaption && hall && (
        <figcaption className="mt-4">
          <Link href={`/halls/${hall.id}`} className="hit t-small hover-fill-host text-ink-soft">
            <HoverFill>{site.ui.shotInHall(hall.name)} →</HoverFill>
          </Link>
        </figcaption>
      )}
    </figure>
  );
}
