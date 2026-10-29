import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset", {
  variants: {
    tone: {
      blue: "bg-accent/10 text-accent ring-accent/20",
      green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
      amber: "bg-amber-50 text-amber-700 ring-amber-600/15",
      gray: "bg-navy-50 text-navy-500 ring-navy-200",
      navy: "bg-navy-900 text-white ring-navy-900",
    },
  },
  defaultVariants: { tone: "gray" },
});

export function Badge({ tone, className, children, dot }: VariantProps<typeof badge> & { className?: string; children: React.ReactNode; dot?: boolean }) {
  return (
    <span className={cn(badge({ tone }), className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
