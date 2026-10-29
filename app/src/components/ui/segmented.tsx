"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Segmented<T extends string>({ options, value, onChange, id }: { options: readonly T[]; value: T; onChange: (v: T) => void; id: string }) {
  return (
    <div className="inline-flex rounded-lg bg-navy-50 p-0.5" role="tablist">
      {options.map((o) => (
        <button key={o} role="tab" aria-selected={value === o} onClick={() => onChange(o)}
          className={cn("relative cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors", value === o ? "text-navy-900" : "text-navy-400 hover:text-navy-700")}>
          {value === o && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-md bg-white shadow-sm" transition={{ type: "spring", bounce: 0.15, duration: 0.4 }} />}
          <span className="relative">{o}</span>
        </button>
      ))}
    </div>
  );
}
