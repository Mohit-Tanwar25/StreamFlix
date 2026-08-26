import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/50 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md";

    const variants = {
      primary:
        "bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand/20 active:scale-[0.98]",
      secondary:
        "bg-white text-black hover:bg-white/90 shadow-md active:scale-[0.98]",
      outline:
        "border border-cinema-border hover:bg-white/10 text-cinema-text active:scale-[0.98]",
      ghost:
        "hover:bg-white/10 text-cinema-text active:scale-[0.98]",
      danger:
        "bg-red-600/90 hover:bg-red-700 text-white shadow-md active:scale-[0.98]",
      glass:
        "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 active:scale-[0.98]",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
      icon: "h-10 w-10 p-0 rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
