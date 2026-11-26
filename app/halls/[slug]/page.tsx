import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { site, hallById, type HallId } from "@/content/site";
import { formatTenge, pad2 } from "@/lib/format";
import { hallTransitionName } from "@/lib/names";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBookBar } from "@/components/layout/MobileBookBar";
import { Heading } from "@/components/ui/Heading";
import { DashList } from "@/components/ui/DashList";
import { FitWord } from "@/components/ui/FitWord";
import { BookButton } from "@/components/ui/Button";
import { Composition } from "@/components/ui/Composition";
import { HallLink } from "@/components/ui/HallLink";
import { HoverFill } from "@/components/ui/HoverFill";
import { BlurIn } from "@/components/motion/BlurIn";
import { FadeReveal } from "@/components/motion/FadeReveal";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return site.halls.map((h) => ({ slug: h.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const hall = hallById(slug as HallId);
  if (!hall) return {};
  const title = site.hallPage.seoTitle(hall.name);
  return {
    title,
    description: hall.page.seoDescription,
    alternates: { canonical: `/halls/${hall.id}` },
    openGraph: { title, description: hall.page.seoDescription, images: [{ url: hall.image }] },
  };
}

export default async function HallPage({ params }: Params) {
  const { slug } = await params;
  const hall = hallById(slug as HallId);
  if (!hall) notFound();
  const t = site.hallPage;
  const collections = site.works.filter((w) => w.hallId === hall.id);
  const others = site.halls.filter((h) => h.id !== hall.id);

  return (
    <>
      <Header homeHref="/" />
      <main id="main">
        {/* 1. Hero: фото на всю ширину, сюда «перелетает» фото с главной */}
        <section id="top" data-hero-dark="" className="relative h-[80svh] min-h-[560px] overflow-hidden">
          <BlurIn trigger="load" duration={1.2} className="absolute inset-0 overflow-hidden">
            <div
              data-hall-hero={hall.id}
              className="absolute inset-0"
              style={{ viewTransitionName: hallTransitionName(hall.id), viewTransitionClass: "hall-photo" } as CSSProperties}
            >
              <Image
                src={hall.image}
                alt={hall.imageAlt}
                fill
                priority
                sizes="100vw"
                data-blur-scale=""
                className="content-img object-cover"
                style={{ objectPosition: hall.imagePosition }}
              />
            </div>
          </BlurIn>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(16,18,17,.5) 0%, rgba(16,18,17,0) 30%, transparent 40%, var(--photo-shade) 100%)",
            }}
          />
          <div className="absolute bottom-8 text-on-photo md:bottom-10" style={{ left: "var(--edge)", right: "var(--edge)" }}>
            <FitWord as="h1" text={hall.name} trigger="load" delay={0.2} maxVw={17} align="left" className="leading-[.8]" />
            <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <FadeReveal as="p" trigger="load" delay={0.6} className="font-heading text-[16px] font-normal tracking-[.04em] md:text-[20px]">
                {hall.area} · {site.ui.from} {formatTenge(hall.pricePerHour)}{site.booking.perHourOption}
              </FadeReveal>
              <BlurIn trigger="load" delay={0.8}>
                <BookButton hallId={hall.id} variant="inverse" className="w-full md:w-auto">
                  {site.ui.bookThisHall}
                </BookButton>
              </BlurIn>
            </div>
          </div>
        </section>

        {/* 2. Описание + характеристики */}
        <section className="section">
          <div className="container-x grid-x items-start gap-y-12">
            <FadeReveal childSelector="p" className="col-span-4 flex max-w-[56ch] flex-col gap-5 md:col-span-8 lg:col-start-1 lg:col-end-7">
              {hall.page.paragraphs.map((p) => (
                <p key={p} className="t-body">
                  {p}
                </p>
              ))}
            </FadeReveal>
            <div className="col-span-4 md:col-span-6 lg:col-start-8 lg:col-end-13">
              <h2 className="t-h4 text-ink-soft">{t.specsTitle}</h2>
              <DashList items={hall.specs} className="mt-6" />
              <div className="mt-10 flex items-baseline">
                <span className="t-price">{formatTenge(hall.pricePerHour)}</span>
                <span className="t-small ml-2">{site.ui.perHour}</span>
              </div>
              <div className="t-small mt-1 text-ink-soft">{site.ui.minHours(hall.minHours)}</div>
            </div>
          </div>
        </section>

        {/* 3. Что здесь снимают */}
        {collections.length > 0 && (
          <section className="section pt-0 md:pt-0 lg:pt-0">
            <div className="container-x">
              <Heading text={t.whatTitle} className="t-h2" />
              <div className={`after-h2 grid gap-12 ${collections.length > 1 ? "lg:grid-cols-2 lg:gap-6" : "lg:w-7/12"}`}>
                {collections.map((c) => (
                  <BlurIn key={c.id}>
                    <h3 className="t-h4 mb-5">{c.title}</h3>
                    <Composition collection={c} showCaption={false} />
                  </BlurIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. Оборудование и реквизит */}
        <section className="section pt-0 md:pt-0 lg:pt-0">
          <div className="container-x">
            <Heading text={t.equipmentTitle} className="t-h2" />
            <BlurIn
              as="ul"
              childSelector="li"
              stagger={0.08}
              className="after-h2 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3"
            >
              {hall.page.equipment.map((e) => (
                <li key={e.title} className="bg-bg p-6 lg:p-8">
                  <h3 className="font-heading text-[18px] font-normal uppercase">{e.title}</h3>
                  <p className="t-body mt-3 text-ink-soft">{e.text}</p>
                </li>
              ))}
            </BlurIn>
          </div>
        </section>

        {/* 5. Правила зала */}
        <section className="section pt-0 md:pt-0 lg:pt-0">
          <div className="container-x grid-x items-start gap-y-8">
            <div className="col-span-4 md:col-span-8 lg:col-start-1 lg:col-end-5">
              <Heading text={t.rulesTitle} className="t-h2" />
            </div>
            <ol className="col-span-4 border-t border-line md:col-span-8 lg:col-start-6 lg:col-end-13">
              {hall.page.rules.map((r, i) => (
                <li key={r} className="flex gap-6 border-b border-line py-5">
                  <span className="t-num w-10 shrink-0 text-[22px] md:text-[22px]">{pad2(i + 1)}</span>
                  <FadeReveal as="span" className="t-body">
                    {r}
                  </FadeReveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Другие залы */}
        <section className="section pt-0 md:pt-0 lg:pt-0">
          <div className="container-x">
            <Heading text={t.otherTitle} className="t-h2" />
            <BlurIn childSelector="[data-other]" stagger={0.08} className="after-h2 grid grid-cols-1 gap-6 md:grid-cols-2">
              {others.map((h) => (
                <article key={h.id} data-other="">
                  <HallLink hallId={h.id} className="hover-fill-host group block">
                    <span
                      className="relative block aspect-[4/3] overflow-hidden bg-surface"
                      style={{ viewTransitionName: hallTransitionName(h.id), viewTransitionClass: "hall-photo" } as CSSProperties}
                    >
                      <Image
                        src={h.image}
                        alt={h.imageAlt}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="content-img object-cover"
                        style={{ objectPosition: h.imagePosition }}
                      />
                    </span>
                    <span className="mt-5 flex items-baseline justify-between gap-4">
                      <span className="t-h3">
                        <HoverFill>{h.name}</HoverFill>
                      </span>
                      <span className="t-small whitespace-nowrap text-ink-soft">
                        {site.ui.from} {formatTenge(h.pricePerHour)}{site.booking.perHourOption}
                      </span>
                    </span>
                  </HallLink>
                </article>
              ))}
            </BlurIn>
          </div>
        </section>
      </main>
      <Footer homeHref="/" />
      <MobileBookBar />
    </>
  );
}
