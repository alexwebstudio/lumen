"use client";

import { site } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { FadeReveal } from "@/components/motion/FadeReveal";
import { Button } from "@/components/ui/Button";

export function StepDone({ onClose }: { onClose: () => void }) {
  const d = site.booking.done;
  return (
    <div className="flex flex-1 flex-col justify-center py-10">
      <div
        aria-hidden="true"
        className="flex size-[72px] items-center justify-center rounded-full border border-ink text-[28px] leading-none"
      >
        ✓
      </div>
      <Heading
        id="booking-title"
        text={d.title}
        trigger="load"
        className="font-heading mt-8 text-[28px] leading-[.95] tracking-[-.02em] lg:text-[34px]"
      />
      <FadeReveal as="p" trigger="load" delay={0.2} className="t-body mt-5 max-w-[40ch]">
        {d.text}
      </FadeReveal>
      <Button className="mt-8 self-start" onClick={onClose}>
        {d.close}
      </Button>
    </div>
  );
}
