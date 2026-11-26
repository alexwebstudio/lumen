import Image from "next/image";
import { site } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { FadeReveal } from "@/components/motion/FadeReveal";
import { BlurIn } from "@/components/motion/BlurIn";

export function About() {
  const { about } = site;
  return (
    <section id="about" className="section">
      <div className="container-x">
        <Heading text={about.title} className="t-h2 mx-auto max-w-[1100px] text-center" />

        <div className="grid-x after-h2 items-start gap-y-8">
          <BlurIn className="relative col-span-4 aspect-[3/2] overflow-hidden md:col-span-8 lg:order-2 lg:col-start-7 lg:col-end-13">
            <Image
              src={about.image}
              alt={about.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              data-blur-scale=""
              className="content-img object-cover"
              style={{ objectPosition: about.imagePosition }}
            />
          </BlurIn>
          <FadeReveal
            childSelector="p"
            className="col-span-4 flex max-w-[46ch] flex-col gap-[18px] pt-2 md:col-span-6 lg:order-1 lg:col-start-1 lg:col-end-6"
          >
            {about.paragraphs.map((p) => (
              <p key={p} className="t-body">
                {p}
              </p>
            ))}
          </FadeReveal>
        </div>

        <BlurIn
          as="ul"
          childSelector="li"
          stagger={0.08}
          className="mt-[88px] grid grid-cols-2 border-t border-line md:mt-[120px] lg:grid-cols-12"
        >
          {about.stats.map((s, i) => (
            <li
              key={s.label}
              className={[
                "py-6 pr-4 lg:col-span-3 lg:pt-7 lg:pr-6 lg:pb-0",
                // мобайл/планшет 2×2: линия слева у правой колонки, сверху у второй строки
                i % 2 === 1 ? "border-l border-line pl-4 lg:pl-6" : "pl-0",
                i >= 2 ? "border-t border-line lg:border-t-0" : "",
                // десктоп: линия слева у всех, кроме первой
                i === 2 ? "lg:border-l lg:pl-6" : "",
              ].join(" ")}
            >
              <div className="t-stat">{s.value}</div>
              <div className="t-h4 mt-4">{s.label}</div>
              <p className="t-small mt-5 max-w-[28ch] text-ink-soft">{s.text}</p>
            </li>
          ))}
        </BlurIn>
      </div>
    </section>
  );
}
