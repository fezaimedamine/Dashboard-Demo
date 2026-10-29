"use client";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, delta, icon: Icon, hint, index = 0 }: { label: string; value: string; delta: number; icon: LucideIcon; hint: string; index?: number }) {
  const up = delta >= 0;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
      <Card className="p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(15,27,51,0.2)]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-navy-400">{label}</p>
          <span className="grid size-8 place-items-center rounded-lg bg-navy-50 text-navy-700"><Icon className="size-4" /></span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-navy-900 tabular">{value}</p>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className={cn("inline-flex items-center gap-0.5 font-medium", up ? "text-emerald-600" : "text-red-500")}>
            {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{Math.abs(delta)}%
          </span>
          <span className="text-navy-400">{hint}</span>
        </div>
      </Card>
    </motion.div>
  );
}
