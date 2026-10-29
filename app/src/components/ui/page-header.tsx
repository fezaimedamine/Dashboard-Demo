"use client";
import { motion } from "framer-motion";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-medium text-navy-400">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy-950">{title}</h1>
        {description && <p className="mt-1 text-sm text-navy-400">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
