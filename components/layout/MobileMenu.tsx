"use client";

import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { formatTenge } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { HoverFill } from "@/components/ui/HoverFill";
import { useLenis, scrollToTarget } from "@/components/motion/SmoothScroll";
import { useBooking } from "@/components/booking/BookingProvider";

/** Содержимое мобильной стеклянной панели (<1024): ссылки, мини-карточки залов, бронь, мессенджеры. */
export function MobileMenuPanel({ homeHref, onClose }: { homeHref: string; onClose: () => void }) {
  const lenis = useLenis();
  const { open } = useBooking();
  const onHome = homeHref === "";

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!onHome) return onClose(); // уходим на главную с якорем
    e.preventDefault();
    onClose();
    lenis?.start();
    requestAnimationFrame(() => scrollToTarget(lenis, href));
  };

  return (
    <div
      id="mobile-menu"
      data-lenis-prevent=""
      className="no-scrollbar flex h-[calc(100%-56px)] flex-col overflow-y-auto px-5 pb-5 lg:hidden"
    >
      <nav aria-label={site.ui.menu}>
        <ul className="flex flex-col">
          {site.nav.map((item) => (
            <li key={item.href} data-menu-item="" className="border-b border-line">
              <a
                href={`${homeHref}${item.href}`}
                onClick={(e) => go(e, item.href)}
                className="hover-fill-host font-heading flex h-[52px] items-center justify-between text-[26px] leading-none"
              >
                <HoverFill>{item.label}</HoverFill>
                <span aria-hidden="true" className="text-[20px]">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <ul className="mt-5 grid grid-cols-3 gap-2.5">
        {site.halls.map((hall) => (
          <li key={hall.id} data-menu-item="">
            <Link href={`/halls/${hall.id}`} onClick={onClose} className="block">
              <span className="relative block aspect-square overflow-hidden bg-surface">
                <Image src={hall.image} alt="" fill sizes="30vw" className="content-img object-cover" style={{ objectPosition: hall.imagePosition }} />
              </span>
              <span className="font-heading mt-2 block text-[13px] leading-tight uppercase">{hall.name}</span>
              <span className="t-small block text-ink-soft">
                {formatTenge(hall.pricePerHour)}
                {site.booking.perHourOption}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5" data-menu-item="">
        <Button
          className="w-full"
          onClick={() => {
            onClose();
            open();
          }}
        >
          {site.ui.bookHall}
        </Button>
        <div className="t-small mt-4 flex items-center justify-center gap-6">
          <a href={site.contacts.telegram.url} target="_blank" rel="noopener">
            {site.contacts.telegram.label}
          </a>
          <a href={site.contacts.whatsapp.url} target="_blank" rel="noopener">
            {site.contacts.whatsapp.label}
          </a>
        </div>
      </div>
    </div>
  );
}
