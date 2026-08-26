import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brand" | "outline" | "success" | "warning" | "hd";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-cinema-surfaceLight text-cinema-text border-transparent",
    brand: "bg-brand/20 text-brand-glow border-brand/40",
    outline: "bg-transparent text-cinema-muted border-cinema-border",
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    hd: "bg-transparent text-white font-bold border-white/60 tracking-wider text-[10px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border select-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
