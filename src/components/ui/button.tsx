import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-7 py-3.5 text-base font-medium tracking-[0.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-deeper disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-cta-gradient text-primary-foreground shadow-[0_0_16px_rgba(78,205,196,0.28),0_0_20px_rgba(92,43,130,0.32)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(78,205,196,0.4),0_0_28px_rgba(92,43,130,0.45)]",
        secondary:
          "border border-white/15 bg-transparent text-muted-foreground hover:border-accent/40 hover:text-foreground",
        ghost: "px-3 text-muted-foreground hover:text-foreground",
        outline:
          "border border-white/10 bg-background text-foreground hover:border-primary/60"
      },
      size: {
        default: "h-12",
        sm: "h-10 px-5 text-[15px]",
        lg: "h-14 px-8",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
