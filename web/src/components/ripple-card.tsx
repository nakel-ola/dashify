import { useNextTheme } from "@/hooks/use-next-theme";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, MouseEvent } from "react";

interface RippleCardProps extends HTMLAttributes<HTMLDivElement> {
  Component?: any;
}

export const RippleCard = (props: RippleCardProps) => {
  const { className, onMouseDown, Component = "div", ...rest } = props;
  const { theme } = useNextTheme();

  return (
    <Component
      className={cn("cursor-pointer", className)}
      onMouseDown={(e: any) => {
        ripple(e, theme === "dark" ? "light" : "dark");
        onMouseDown?.(e);
      }}
      {...rest}
    />
  );
};

type Color = "light" | "dark" | string;
export const ripple = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  color: Color
) => {
  let x: number = 0,
    y: number = 0,
    z: number = 0;
  const element = event.currentTarget!;

  element.style.position = "relative";
  element.style.overflow = "hidden";

  const rect = element.getBoundingClientRect();

  const findFurthestPoint = (
    clickPointX: number,
    elementWidth: number,
    offsetX: number,
    clickPointY: number,
    elementHeight: number,
    offsetY: number
  ) => {
    x = clickPointX - offsetX > elementWidth / 2 ? 0 : elementWidth;
    y = clickPointY - offsetY > elementHeight / 2 ? 0 : elementHeight;
    z = Math.hypot(x - (clickPointX - offsetX), y - (clickPointY - offsetY));

    return z;
  };

  const appyStyles = (
    element: HTMLElement,
    color: Color,
    rect: DOMRect,
    radius: number,
    event: MouseEvent<
      HTMLButtonElement,
      MouseEvent<Element, globalThis.MouseEvent>
    >
  ) => {
    element.classList.add("ripple");
    element.style.backgroundColor =
      color === "dark"
        ? "rgba(0,0,0, 0.2)"
        : color === "light"
        ? "rgba(255,255,255, 0.3)"
        : color;
    element.style.borderRadius = "50%";
    element.style.pointerEvents = "none";
    element.style.position = "absolute";
    element.style.left = event.clientX - rect.left - radius + "px";
    element.style.top = event.clientY - rect.top - radius + "px";
    element.style.width = element.style.height = radius * 2 + "px";
  };

  const applyAnimation = (element: HTMLElement) => {
    element.animate(
      [
        {
          transform: "scale(0)",
          opacity: 1,
        },
        {
          transform: "scale(1.5)",
          opacity: 0,
        },
      ],
      {
        duration: 500,
        easing: "linear",
      }
    );
  };

  const radius = findFurthestPoint(
    event.clientX,
    element.offsetWidth,
    rect.left,
    event.clientY,
    element.offsetHeight,
    rect.top
  );

  const circle = document.createElement("span");

  appyStyles(circle, color, rect, radius, event);

  applyAnimation(circle);

  element.appendChild(circle);

  setTimeout(() => circle.remove(), 500);
};
