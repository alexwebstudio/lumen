import type { ReactNode } from "react";

/**
 * 3.3 Hover Fill — заливка текста цветом --accent слева направо.
 * Срабатывает при наведении на сам текст или на ближайшего предка с классом .hover-fill-host.
 * На тач-устройствах (hover: none) не активируется — см. globals.css.
 */
export function HoverFill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`hover-fill hover-fill-host ${className}`}>
      <span>{children}</span>
      <span className="hover-fill__top" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
