import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden shadow-lg hover:shadow-xl",
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-primary-foreground bg-gradient-to-b from-primary/80 to-primary/100 border-t border-primary/50 hover:-translate-y-1 active:translate-y-0.5 active:shadow-md before:content-[''] before:absolute before:inset-0 before:border-t before:border-l before:border-white/20 before:pointer-events-none",
        destructive:
          "bg-destructive text-destructive-foreground bg-gradient-to-b from-destructive/80 to-destructive/100 border-t border-destructive/50 hover:-translate-y-1 active:translate-y-0.5 active:shadow-md before:content-[''] before:absolute before:inset-0 before:border-t before:border-l before:border-white/20 before:pointer-events-none",
        outline:
          "border border-input bg-background shadow-md hover:shadow-lg hover:bg-accent hover:text-accent-foreground hover:-translate-y-1 active:translate-y-0.5 active:shadow-sm before:content-[''] before:absolute before:inset-0 before:border-t before:border-l before:border-white/20 before:pointer-events-none",
        secondary:
          "bg-secondary text-secondary-foreground bg-gradient-to-b from-secondary/80 to-secondary/100 border-t border-secondary/50 hover:-translate-y-1 active:translate-y-0.5 active:shadow-md before:content-[''] before:absolute before:inset-0 before:border-t before:border-l before:border-white/20 before:pointer-events-none",
        ghost: 
          "hover:bg-accent hover:text-accent-foreground shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0.5 active:shadow-sm before:content-[''] before:absolute before:inset-0 before:border-t before:border-l before:border-white/20 before:pointer-events-none",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        suppressHydrationWarning={Comp === "button"}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };