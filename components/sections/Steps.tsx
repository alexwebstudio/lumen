import { site } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { BlurIn } from "@/components/motion/BlurIn";
import { FadeReveal } from "@/components/motion/FadeReveal";

export function Steps() {
  const { stepsSection, steps } = site;
  return (
    <section id="steps" className="section">
      <div className="container-x">
        <div className="grid-x">
          <Heading text={stepsSection.title} className="t-h2 col-span-4 md:col-span-8 lg:col-start-1 lg:col-end-9" />
        </div>
        <BlurIn
          as="ol"
          childSelector="li"
          stagger={0.1}
          className="after-h2 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-5 lg:grid-cols-12 lg:gap-6"
        >
          {steps.map((step) => (
            <li key={step.num} className="border-t border-ink pt-6 lg:col-span-3">
              <div className="t-num">{step.num}</div>
              <h3 className="t-h4 mt-10">{step.title}</h3>
              <FadeReveal as="p" className="t-body mt-3 max-w-[46ch] text-ink-soft">
                {step.text}
              </FadeReveal>
            </li>
          ))}
        </BlurIn>
      </div>
    </section>
  );
}
