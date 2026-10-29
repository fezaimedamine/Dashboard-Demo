"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, FolderKanban, Megaphone, Sparkles, Users, BarChart3, Settings, X, LifeBuoy, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

type Item = { href: string; label: string; icon: LucideIcon; count?: "projects" | "campaigns" };

export const navItems: Item[] = [
  { href: "/", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/projets", label: "Projets", icon: FolderKanban, count: "projects" },
  { href: "/campagnes", label: "Campagnes IA", icon: Megaphone, count: "campaigns" },
  { href: "/studio", label: "Studio IA", icon: Sparkles },
  { href: "/analytique", label: "Analytique", icon: BarChart3 },
  { href: "/equipe", label: "Equipe", icon: Users },
];
export const footerItems: Item[] = [
  { href: "/support", label: "Support", icon: LifeBuoy },
  { href: "/parametres", label: "Parametres", icon: Settings },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavLink({ item, on, count, onNavigate }: { item: Item; on: boolean; count?: number; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} onClick={onNavigate} aria-current={on ? "page" : undefined}
      className={cn("relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", on ? "text-white" : "hover:bg-white/5 hover:text-white")}>
      {on && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-lg bg-white/10 ring-1 ring-white/10" transition={{ type: "spring", bounce: 0.15, duration: 0.45 }} />}
      <Icon className="relative size-4" />
      <span className="relative flex-1 text-left">{item.label}</span>
      {count !== undefined && <span className="relative rounded-md bg-white/10 px-1.5 text-[10px] tabular">{count}</span>}
    </Link>
  );
}

function Content({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { projects, campaigns } = useAppStore();
  const counts = { projects: projects.filter((p) => p.status !== "Termine").length, campaigns: campaigns.filter((c) => c.status === "Active").length };
  return (
    <div className="flex h-full flex-col bg-navy-950 px-3 py-5 text-navy-200">
      <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5 px-2.5">
        <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-navy-600 shadow-lg shadow-accent/30"><Sparkles className="size-4 text-white" /></div>
        <div><p className="text-sm font-semibold text-white">Nocturne</p><p className="text-[11px] text-navy-400">Studio creatif</p></div>
      </Link>
      <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-wider text-navy-500">Espace de travail</p>
      <nav className="mt-2 space-y-0.5">
        {navItems.map((it) => <NavLink key={it.href} item={it} on={isActive(pathname, it.href)} count={it.count && counts[it.count]} onNavigate={onNavigate} />)}
      </nav>
      <div className="mt-auto space-y-3">
        <Link href="/parametres" onClick={onNavigate} className="block rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 p-4 ring-1 ring-white/5 transition hover:ring-white/20">
          <p className="text-xs font-semibold text-white">Credits IA</p>
          <p className="mt-1 text-[11px] text-navy-400">7 420 / 10 000 utilises</p>
          <div className="mt-3 h-1.5 rounded-full bg-white/10"><div className="h-full w-[74%] rounded-full bg-accent" /></div>
        </Link>
        <div className="space-y-0.5">{footerItems.map((it) => <NavLink key={it.href} item={it} on={isActive(pathname, it.href)} onNavigate={onNavigate} />)}</div>
      </div>
    </div>
  );
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block"><Content /></aside>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.aside className="absolute inset-y-0 left-0 w-64" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", bounce: 0, duration: 0.35 }}>
              <button aria-label="Fermer le menu" onClick={onClose} className="absolute right-3 top-5 z-10 cursor-pointer rounded-md p-1 text-navy-300 hover:bg-white/10"><X className="size-4" /></button>
              <Content onNavigate={onClose} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
