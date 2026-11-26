import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBookBar } from "@/components/layout/MobileBookBar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Halls } from "@/components/sections/Halls";
import { Works } from "@/components/sections/Works";
import { Why } from "@/components/sections/Why";
import { Prices } from "@/components/sections/Prices";
import { Steps } from "@/components/sections/Steps";
import { Reviews } from "@/components/sections/Reviews";
import { Faq } from "@/components/sections/Faq";
import { Contacts } from "@/components/sections/Contacts";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Halls />
        <Works />
        <Why />
        <Prices />
        <Steps />
        <Reviews />
        <Faq />
        <Contacts />
      </main>
      <Footer />
      <MobileBookBar />
    </>
  );
}
