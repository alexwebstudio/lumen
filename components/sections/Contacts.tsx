import { site } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { HoverFill } from "@/components/ui/HoverFill";
import { BookButton } from "@/components/ui/Button";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { FadeReveal } from "@/components/motion/FadeReveal";
import { BlurIn } from "@/components/motion/BlurIn";

function Label({ children }: { children: React.ReactNode }) {
  return <div className="t-small mb-2 text-ink-soft">{children}</div>;
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="hover-fill-host t-body self-start">
      <HoverFill>{children}</HoverFill>
    </a>
  );
}

export function Contacts() {
  const c = site.contacts;
  return (
    <section id="contacts" className="section">
      <div className="container-x">
        <div className="grid-x items-stretch gap-y-4">
          <BlurIn className="col-span-4 md:col-span-8 lg:order-2 lg:col-start-7 lg:col-end-13">
            <MapEmbed className="aspect-[4/5] h-full w-full md:aspect-[4/3] lg:aspect-auto lg:min-h-[640px]" />
          </BlurIn>

          <div className="col-span-4 flex flex-col justify-between bg-surface-2 p-7 md:col-span-8 lg:order-1 lg:col-start-1 lg:col-end-7 lg:min-h-[640px] lg:p-12">
            <div>
              <Heading text={c.title} className="t-h2" />
              <FadeReveal as="p" className="t-body mt-6 max-w-[40ch]">
                {c.text}
              </FadeReveal>
              <BookButton className="mt-8 w-full md:w-auto">{site.ui.bookHall}</BookButton>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <Label>{c.labels.address}</Label>
                  <span className="t-body">{c.address}</span>
                  <span className="mt-2">
                    <ExtLink href={c.gis2Url}>{c.route}</ExtLink>
                  </span>
                </div>
                <div>
                  <Label>{c.labels.hours}</Label>
                  <span className="t-body">{c.hours}</span>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <Label>{c.labels.phone}</Label>
                  <a href={c.phoneHref} className="hover-fill-host t-body self-start">
                    <HoverFill>{c.phone}</HoverFill>
                  </a>
                </div>
                <div className="flex flex-col gap-1">
                  <Label>{c.labels.socials}</Label>
                  <ExtLink href={c.telegram.url}>{c.telegram.label}</ExtLink>
                  <ExtLink href={c.whatsapp.url}>{c.whatsapp.label}</ExtLink>
                  <ExtLink href={c.instagram.url}>{c.instagram.label}</ExtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
