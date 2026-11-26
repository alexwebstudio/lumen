"use client";

import { site } from "@/content/site";
import { nbspPrice } from "@/lib/format";
import { Heading } from "@/components/ui/Heading";
import { DashList } from "@/components/ui/DashList";
import { Button } from "@/components/ui/Button";
import { BlurIn } from "@/components/motion/BlurIn";
import { useBooking } from "@/components/booking/BookingProvider";

export function Prices() {
  const { pricesSection, prices } = site;
  const { open, openFormat } = useBooking();
  return (
    <section id="prices" className="section">
      <div className="container-x">
        <Heading text={pricesSection.title} className="t-h2 text-center" />
        <BlurIn
          childSelector="[data-price-card]"
          stagger={0.08}
          className="after-h2 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3 md:[&>*:last-child]:col-span-2 xl:[&>*:last-child]:col-span-1"
        >
          {prices.map((card) => (
            <article
              key={card.id}
              data-price-card=""
              className={`flex flex-col justify-between gap-10 px-6 py-8 md:min-h-[420px] lg:px-8 lg:py-9 xl:min-h-[480px] ${
                card.dark ? "bg-dark text-on-dark" : "bg-surface text-ink"
              }`}
            >
              <div>
                <h3 className="t-h4">{card.title}</h3>
                <p className={`t-small mt-3 ${card.dark ? "text-on-dark-soft" : "text-ink-soft"}`}>{card.subtitle}</p>
                <DashList items={card.items.slice(0, 3)} className="mt-9" onDark={card.dark} />
              </div>
              <div>
                <div className="t-price whitespace-nowrap">{nbspPrice(card.price)}</div>
                <div className="mt-6 flex flex-col items-stretch gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
                  <Button
                    variant={card.dark ? "inverse" : "primary"}
                    onClick={() => open(undefined, { options: card.bookingOptions })}
                  >
                    {site.ui.signUp}
                  </Button>
                  <Button variant="link" onClick={() => openFormat(card.id)} className="self-center sm:self-auto">
                    {site.ui.details}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </BlurIn>
      </div>
    </section>
  );
}
