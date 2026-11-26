"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { blurInSet, blurInTo } from "@/lib/effects";

/* Кроссфейд фото: новое появляется поверх старого эффектом Blur In. */
function Layer({
  src,
  alt,
  sizes,
  animate,
  duration,
  position,
}: {
  src: string;
  alt: string;
  sizes: string;
  animate: boolean;
  duration: number;
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el || !animate || prefersReducedMotion()) return;
    blurInSet([el]);
    blurInTo([el], { duration });
  }, []);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <Image src={src} alt={alt} fill sizes={sizes} data-blur-scale="" className="content-img object-cover" style={{ objectPosition: position }} />
    </div>
  );
}

export function PhotoStack({
  src,
  alt,
  sizes,
  duration = 0.6,
  position,
}: {
  src: string;
  alt: string;
  sizes: string;
  duration?: number;
  /** CSS object-position — фокус кадра */
  position?: string;
}) {
  const [layers, setLayers] = useState([{ src, key: 0 }]);
  const prev = useRef(src);
  useEffect(() => {
    if (src === prev.current) return;
    prev.current = src;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLayers((l) => [...l.slice(-1), { src, key: l[l.length - 1].key + 1 }]);
  }, [src]);
  return (
    <>
      {layers.map((l, i) => (
        <Layer
          key={l.key}
          src={l.src}
          alt={i === layers.length - 1 ? alt : ""}
          sizes={sizes}
          animate={l.key > 0}
          duration={duration}
          position={position}
        />
      ))}
    </>
  );
}
