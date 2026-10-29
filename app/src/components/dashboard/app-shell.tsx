"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, CheckCircle2 } from "lucide-react";
import { NotificationsMenu } from "./notifications-menu";
import { CreateProjectDialog } from "./create-project-dialog";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { AppStoreProvider, useAppStore } from "@/lib/store";

function Shell({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const { query, setQuery, toast } = useAppStore();
  return (
    <div className="min-h-screen">
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-navy-100/70 bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-8">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu" onClick={() => setMenu(true)}><Menu /></Button>
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-300" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher projets, clients, campagnes..." aria-label="Rechercher"
                className="h-9 w-full rounded-lg border border-transparent bg-navy-50 pl-9 pr-3 text-sm text-navy-900 outline-none transition placeholder:text-navy-300 focus:border-accent/40 focus:bg-white focus:ring-3 focus:ring-accent/10" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <CreateProjectDialog compact />
              <NotificationsMenu />
              <Link href="/parametres" aria-label="Mon profil" className="grid size-9 place-items-center rounded-full bg-navy-900 text-xs font-semibold text-white">VO</Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-sm text-white shadow-xl">
            <CheckCircle2 className="size-4 text-emerald-400" />{toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return <AppStoreProvider><Shell>{children}</Shell></AppStoreProvider>;
}
