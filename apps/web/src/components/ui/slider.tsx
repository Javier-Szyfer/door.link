"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { isBuffering?: boolean }
>(({ className, isBuffering = false, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    aria-busy={isBuffering}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-stone-200 dark:bg-stone-400">
      <SliderPrimitive.Range className="absolute h-full bg-[#1500FF] dark:bg-stone-300" />
      {isBuffering && (
        <div className="absolute inset-0 animate-buffering bg-gradient-to-r from-transparent via-white/70 to-transparent motion-reduce:translate-x-0 motion-reduce:animate-pulse" />
      )}
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-stone-200 bg-stone-100 ring-offset-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
