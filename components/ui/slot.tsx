"use client";

import * as React from "react";
import * as SlotPrimitive from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const Slot = SlotPrimitive.Slot;

export interface SlotProps
  extends React.ComponentPropsWithoutRef<typeof SlotPrimitive.Slot> {
  asChild?: boolean;
}

// Re-implement SlotClone with a safer approach
const SlotClone = React.forwardRef<
  React.ElementRef<typeof SlotPrimitive.Slot>,
  React.ComponentPropsWithoutRef<typeof SlotPrimitive.Slot> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  // Safely pass children to Slot without trying to modify them
  return (
    <Slot {...props} ref={ref} className={cn(className)}>
      {children}
    </Slot>
  );
});

SlotClone.displayName = "SlotClone";

export { Slot, SlotClone };
