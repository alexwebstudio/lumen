import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@fontsource/unbounded/latin-500.css";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { BookingProvider } from "@/components/booking/BookingProvider";

// 3 гарнитуры. Шрифты — сабсеты variable-файлов (OFL), браузер добирает глифы по стеку.
// Заголовки, LUMEN, меню, кнопки, лого — Inter Tight.
const tightCyr = localFont({
  src: "../public/fonts/InterTight-Variable-Cyrillic.woff2",
  variable: "--font-tight-cyr",
  display: "swap",
  weight: "100 900",
  fallback: [],
  adjustFontFallback: false,
});
const tightLat = localFont({
  src: "../public/fonts/InterTight-Variable-Latin.woff2",
  variable: "--font-tight-lat",
  display: "swap",
  weight: "100 900",
  fallback: ["Arial", "sans-serif"],
});

// Текст, подписи, формы, цифры — Manrope.
const manropeCyr = localFont({
  src: "../public/fonts/Manrope-Variable-Cyrillic.woff2",
  variable: "--font-manrope-cyr",
  display: "swap",
  weight: "200 800",
  fallback: [],
  adjustFontFallback: false,
});
const manropeLat = localFont({
  src: "../public/fonts/Manrope-Variable-Latin.woff2",
  variable: "--font-manrope-lat",
  display: "swap",
  weight: "200 800",
  fallback: ["Arial", "sans-serif"],
});
const manropeExt = localFont({
  src: "../public/fonts/Manrope-Variable-LatinExt.woff2",
  variable: "--font-manrope-ext",
  display: "swap",
  weight: "200 800",
  fallback: [],
  adjustFontFallback: false,
  preload: false,
});

const fontVars = [tightCyr, tightLat, manropeCyr, manropeLat, manropeExt].map((f) => f.variable).join(" ");

export const metadata: Metadata = {
  metadataBase: new URL(site.brand.url),
  title: site.seo.title,
  description: site.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.seo.locale,
    url: "/",
    siteName: site.brand.name,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: site.seo.title }],
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description, images: [site.seo.ogImage] },
};

export const viewport: Viewport = {
  themeColor: site.seo.themeColor,
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.brand.name,
  description: site.brand.description,
  url: site.brand.url,
  image: `${site.brand.url}${site.seo.ogImage}`,
  telephone: site.contacts.phone,
  priceRange: site.seo.priceRange,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contacts.streetAddress,
    addressLocality: site.brand.city,
    addressCountry: "KZ",
  },
  geo: { "@type": "GeoCoordinates", latitude: site.contacts.coords.lat, longitude: site.contacts.coords.lng },
  openingHours: site.contacts.openingHours,
  sameAs: [site.contacts.instagram.url, site.contacts.telegram.url],
};

// До гидрации: 1) тема из ?theme=a|b|c (запоминается на вкладку), 2) класс js-wait,
// чтобы элементы с эффектами не мигали до gsap.set().
const preScript = `(function(){try{var d=document.documentElement;var q=new URLSearchParams(location.search).get("theme");var t=/^[abc]$/.test(q||"")?q:null;try{if(t)sessionStorage.setItem("lumen-theme",t);else t=sessionStorage.getItem("lumen-theme")}catch(e){}d.setAttribute("data-theme",t||"a");if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("js-wait")}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVars} data-theme="a" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {site.ui.skipToContent}
        </a>
        <SmoothScroll>
          <BookingProvider>{children}</BookingProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
