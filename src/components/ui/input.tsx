import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-md border border-white/10 bg-background px-4 py-3 text-foreground placeholder:text-[#5A5675] transition duration-200 focus:border-primary/70 focus:outline-none focus:ring-4 focus:ring-primary/15",
        invalid && "animate-shake border-[#E24B4A] focus:border-[#E24B4A]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
