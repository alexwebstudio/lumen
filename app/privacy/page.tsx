import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Heading } from "@/components/ui/Heading";

export const metadata: Metadata = {
  title: site.seo.privacyTitle,
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  const p = site.privacy;
  return (
    <>
      <Header homeHref="/" />
      <main id="main" className="section pt-[160px]">
        <div className="container-x">
          <Heading text={p.title} as="h1" className="t-h2 max-w-[18ch]" animate={false} />
          <div className="after-h2 flex max-w-[46ch] flex-col gap-[18px]">
            {p.paragraphs.map((t) => (
              <p key={t} className="t-body">
                {t}
              </p>
            ))}
            <Link href="/" className="btn-link mt-6 self-start">
              {p.back}
            </Link>
          </div>
        </div>
      </main>
      <Footer homeHref="/" />
    </>
  );
}
