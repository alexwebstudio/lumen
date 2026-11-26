"use client";

import Link from "next/link";
import { site } from "@/content/site";
import { HoverFill } from "@/components/ui/HoverFill";
import { BookButton } from "@/components/ui/Button";
import { FitWord } from "@/components/ui/FitWord";
import { useLenis, scrollToTarget } from "@/components/motion/SmoothScroll";

function FLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const ext = external ?? /^https?:/.test(href);
  return (
    <a href={href} className="hover-fill-host self-start" {...(ext ? { target: "_blank", rel: "noopener" } : {})}>
      <HoverFill>{children}</HoverFill>
    </a>
  );
}

export function Footer({ homeHref = "" }: { homeHref?: string }) {
  const lenis = useLenis();
  const c = site.contacts;
  const f = site.footer;

  return (
    <footer id="footer" className="overflow-x-clip bg-dark pt-20 text-on-dark lg:pt-[120px]">
      <div className="container-x">
        <div className="grid-x t-small gap-y-10">
          <p className="col-span-4 max-w-[32ch] text-on-dark-soft md:col-span-8 lg:col-start-1 lg:col-end-5">{f.text}</p>

          <nav aria-label={site.ui.menu} className="col-span-4 md:col-span-2 lg:col-start-6 lg:col-end-8">
            <ul className="flex flex-col gap-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <FLink href={`${homeHref}${item.href}`}>{item.label}</FLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-4 flex flex-col gap-3 md:col-span-3 lg:col-start-8 lg:col-end-10">
            <FLink href={c.phoneHref}>{c.phone}</FLink>
            <span className="text-on-dark-soft">{c.address}</span>
            <span className="text-on-dark-soft">{c.hours}</span>
          </div>

          <div className="col-span-4 flex flex-col items-start gap-3 md:col-span-3 lg:col-start-10 lg:col-end-13">
            <FLink href={c.telegram.url}>{c.telegram.label}</FLink>
            <FLink href={c.whatsapp.url}>{c.whatsapp.label}</FLink>
            <FLink href={c.instagram.url}>{c.instagram.label}</FLink>
            <BookButton variant="inverse" height={44} className="mt-3">
              {site.ui.book}
            </BookButton>
          </div>
        </div>

        <div className="mt-24 leading-[.8]">
          <FitWord text={site.brand.name} className="text-on-dark !leading-[.8]" />
        </div>

        <div className="t-small mt-10 flex flex-col gap-3 border-t border-line-on-dark pt-6 pb-8 text-on-dark-soft lg:flex-row lg:items-center lg:justify-between">
          <span>{f.copyright}</span>
          <Link href={f.privacy.href} className="hover-fill-host self-start lg:self-auto">
            <HoverFill>{f.privacy.label}</HoverFill>
          </Link>
          <span>
            {f.creditPrefix}
            <a
              href={f.credit.url}
              target="_blank"
              rel="noopener"
              className="hover-fill-host font-credit text-[13px] lowercase tracking-normal text-on-dark"
              style={{ fontWeight: 500 }}
            >
              <HoverFill>{f.credit.label}</HoverFill>
            </a>
          </span>
          <button
            type="button"
            className="hover-fill-host self-start lg:self-auto"
            onClick={() => scrollToTarget(lenis, 0)}
          >
            <HoverFill>{site.ui.toTop}</HoverFill>
          </button>
        </div>
      </div>
    </footer>
  );
}
