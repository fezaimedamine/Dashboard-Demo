import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-navy-100/80 bg-white shadow-[0_1px_2px_rgba(15,27,51,0.04),0_8px_24px_-12px_rgba(15,27,51,0.08)]", className)} {...p} />;
}

export function CardHeader({ title, description, action, className }: { title: string; description?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 p-5 pb-3", className)}>
      <div>
        <h2 className="text-[15px] font-semibold text-navy-900">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-navy-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
