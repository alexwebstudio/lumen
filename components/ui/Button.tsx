"use client";

import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";
import { HoverFill } from "./HoverFill";
import { useBooking } from "@/components/booking/BookingProvider";
import type { HallId } from "@/content/site";

type Variant = "primary" | "inverse" | "link";

type Props = {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
  /** высота кнопки (по умолчанию 52px) */
  height?: number;
  disabled?: boolean;
  type?: "button" | "submit";
  /** стрелка справа; по умолчанию ↗ у primary/inverse и → у ссылки */
  arrow?: string | false;
  arrowLeft?: string;
  ariaLabel?: string;
};

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  height,
  disabled,
  type = "button",
  arrow,
  arrowLeft,
  ariaLabel,
}: Props) {
  const isLink = variant === "link";
  const arrowChar = arrow === false ? null : arrow ?? (isLink ? "→" : "↗");
  const cls = isLink
    ? `btn-link hover-fill-host ${className}`
    : `btn ${variant === "inverse" ? "btn--inverse" : "btn--primary"} ${className}`;
  const style = height ? { height } : undefined;

  const content = isLink ? (
    <>
      {arrowLeft && <span aria-hidden="true">{arrowLeft}</span>}
      <HoverFill>{children}</HoverFill>
      {arrowChar && <span aria-hidden="true">{arrowChar}</span>}
    </>
  ) : (
    <>
      <span>{children}</span>
      {arrowChar && (
        <span className="btn__arrow" aria-hidden="true">
          {arrowChar}
        </span>
      )}
    </>
  );

  if (href) {
    const external = /^https?:/.test(href);
    if (href.startsWith("#") || external) {
      return (
        <a
          href={href}
          className={cls}
          style={style}
          onClick={onClick}
          aria-label={ariaLabel}
          {...(external ? { target: "_blank", rel: "noopener" } : {})}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} style={style} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      style={style}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

/** CTA, открывающая попап бронирования. */
export function BookButton({
  hallId,
  children,
  variant = "primary",
  className,
  height,
}: {
  hallId?: HallId;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  height?: number;
}) {
  const { open } = useBooking();
  return (
    <Button variant={variant} className={className} height={height} onClick={() => open(hallId)}>
      {children}
    </Button>
  );
}
