"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

export function NotificationsMenu() {
  const { feed, unread, markAllRead } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button variant="ghost" size="icon" aria-label={`Notifications (${unread} non lues)`} aria-expanded={open} className="relative" onClick={() => setOpen((o) => !o)}>
        <Bell />
        {unread > 0 && <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-semibold leading-4 text-white tabular">{unread}</span>}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 z-40 w-80 origin-top-right rounded-2xl border border-navy-100 bg-white p-2 shadow-xl">
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-sm font-semibold text-navy-900">Notifications</p>
              <Button variant="ghost" size="sm" disabled={unread === 0} onClick={markAllRead}>Tout marquer comme lu</Button>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {feed.slice(0, 8).map((a, i) => (
                <li key={a.id} className="flex gap-2 rounded-lg px-2 py-2 text-[13px] hover:bg-navy-50">
                  <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${i < unread ? "bg-accent" : "bg-transparent"}`} />
                  <p className="text-navy-500"><span className="font-medium text-navy-900">{a.who}</span> {a.action} <span className="font-medium text-navy-800">{a.target}</span><span className="block text-[11px] text-navy-300">{a.time}</span></p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
