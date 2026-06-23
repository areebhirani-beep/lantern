import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FC,
} from "react";
import { cn } from "@/lib/utils";

// Magic UI / 21st.dev Animated Shiny Text. A shimmer sweeps across the text.
export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px` } as CSSProperties}
      className={cn(
        "text-muted",
        "animate-shiny-text bg-clip-text bg-no-repeat bg-size-[var(--shiny-width)_100%] bg-position-[0_0] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        "bg-linear-to-r from-transparent via-cream/90 via-50% to-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
