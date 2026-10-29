"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={cn("relative h-6 w-10 shrink-0 cursor-pointer rounded-full transition-colors", checked ? "bg-accent" : "bg-navy-100")}>
      <motion.span layout transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
        className={cn("absolute top-1 size-4 rounded-full bg-white shadow", checked ? "right-1" : "left-1")} />
    </button>
  );
}
