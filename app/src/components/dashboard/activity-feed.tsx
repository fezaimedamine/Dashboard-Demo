"use client";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, Sparkles, Upload, FolderPlus } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import type { Activity } from "@/lib/data";

const icons = { ai: Sparkles, comment: MessageSquare, upload: Upload, done: CheckCircle2, create: FolderPlus };
const tones = { ai: "bg-accent/10 text-accent", comment: "bg-navy-50 text-navy-600", upload: "bg-sky-50 text-sky-600", done: "bg-emerald-50 text-emerald-600", create: "bg-navy-900 text-white" };

export type FeedItem = Omit<Activity, "kind"> & { kind: Activity["kind"] | "create" };

export function ActivityFeed({ items }: { items: FeedItem[] }) {
  return (
    <Card>
      <CardHeader title="Activite recente" description="Equipe et assistant IA" />
      <ol className="relative space-y-4 p-5 pt-2">
        {items.slice(0, 6).map((a, i) => {
          const Icon = icons[a.kind];
          return (
            <motion.li key={a.id} layout initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex gap-3">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full ${tones[a.kind]}`}><Icon className="size-3.5" /></span>
              <div className="min-w-0 text-[13px] leading-snug">
                <p className="text-navy-500"><span className="font-medium text-navy-900">{a.who}</span> {a.action} <span className="font-medium text-navy-800">{a.target}</span></p>
                <p className="mt-0.5 text-[11px] text-navy-300">{a.time}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </Card>
  );
}
