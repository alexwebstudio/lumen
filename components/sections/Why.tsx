import Image from "next/image";
import { site, type WhyItem } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { BlurIn } from "@/components/motion/BlurIn";

/** Карточка: фото на фоне, затемнение снизу, белый текст прижат к низу. */
function Cell({ item }: { item: WhyItem }) {
  return (
    <div data-why-cell="" className="relative col-span-2 aspect-[3/4] overflow-hidden bg-surface md:col-span-4 lg:col-span-3">
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(min-width: 1024px) 25vw, 50vw"
        data-blur-scale=""
        className="content-img object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent 35%, var(--photo-shade) 100%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 p-4 text-on-photo md:p-6">
        <h3 className="font-heading text-[15px] leading-[1.15] font-normal md:text-[18px]">{item.title}</h3>
        <p className="mt-2 text-[13px] leading-[1.5] opacity-85 md:text-[14px]">{item.text}</p>
      </div>
    </div>
  );
}

export function Why() {
  const { whySection, why } = site;
  const rows = [why.slice(0, 4), why.slice(4, 8)];
  return (
    <section id="why" className="section">
      <div className="container-x">
        <div className="grid-x">
          <Heading text={whySection.title} className="t-h2 col-span-4 md:col-span-8 lg:col-start-1 lg:col-end-9" />
        </div>
        <div className="after-h2 flex flex-col gap-[10px] md:gap-4">
          {rows.map((row, r) => (
            <BlurIn
              key={r}
              childSelector="[data-why-cell]"
              stagger={0.08}
              className="grid grid-cols-4 gap-[10px] md:grid-cols-8 md:gap-4 lg:grid-cols-12"
            >
              {row.map((item) => (
                <Cell key={item.title} item={item} />
              ))}
            </BlurIn>
          ))}
        </div>
      </div>
    </section>
  );
}
