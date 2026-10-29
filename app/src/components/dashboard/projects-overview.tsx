"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, FolderOpen, TrendingUp, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { Segmented } from "@/components/ui/segmented";
import type { Project } from "@/lib/schemas";
import { eur } from "@/lib/utils";

const statusTone = { "En cours": "blue", Revue: "amber", Planifie: "gray", Termine: "green" } as const;
export const projectFilters = ["Tous", "En cours", "Revue", "Termine"] as const;
export type { ProjectFilter } from "@/lib/projects";
type Filter = (typeof projectFilters)[number];

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

export function ProjectsOverview({ projects, filter = "Tous", onFilter, hideFilter, footer }: { projects: Project[]; filter?: string; onFilter?: (f: Filter) => void; hideFilter?: boolean; footer?: React.ReactNode }) {
  const { advance, archive, loading, loadError, reload } = useAppStore();
  const current = (projectFilters as readonly string[]).includes(filter) ? (filter as Filter) : "Tous";
  return (
    <Card id="projects">
      <CardHeader title="Vue d'ensemble des projets" description={`${projects.length} projet(s) affiche(s)`}
        action={hideFilter || !onFilter ? footer : <div className="flex flex-wrap items-center gap-2"><Segmented id="pf" options={projectFilters} value={current} onChange={onFilter} />{footer}</div>} className="flex-wrap" />
      {loadError ? (
        <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-sm text-navy-500">
          <FolderOpen className="size-8 text-red-300" />{loadError}
          <Button size="sm" variant="outline" onClick={reload}>Reessayer</Button>
        </div>
      ) : loading ? (
        <div className="grid gap-3 p-5 pt-2 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-44 animate-pulse rounded-xl bg-navy-50" />)}</div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-12 text-center text-sm text-navy-400">
          <FolderOpen className="size-8 text-navy-200" />Aucun projet ne correspond a ce filtre.
        </div>
      ) : (
        <div className="grid gap-3 p-5 pt-2 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {projects.map((p) => (
              <motion.article key={p.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}
                className="group rounded-xl border border-navy-100 p-4 transition hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-[0_12px_28px_-18px_rgba(15,27,51,0.35)]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-navy-400">{p.type} - {p.client}</p>
                    <h3 className="mt-0.5 truncate text-sm font-semibold text-navy-900">{p.name}</h3>
                  </div>
                  <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-navy-400">Progression</span>
                  <span className="font-semibold text-navy-800 tabular">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="mt-1.5" />
                <div className="mt-4 flex items-center justify-between">
                  <AvatarStack initials={p.team} />
                  <div className="text-right text-[11px] text-navy-400">
                    <p className="font-semibold text-navy-800 tabular">{eur.format(p.budget)}</p>
                    <p className="flex items-center justify-end gap-1"><CalendarDays className="size-3" />{dateFmt.format(new Date(p.dueDate))}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-navy-50 pt-3">
                  <Button size="sm" variant="outline" className="flex-1" disabled={p.status === "Termine"} onClick={() => advance(p.id)} aria-label={`Faire avancer ${p.name}`}>
                    <TrendingUp />{p.status === "Termine" ? "Livre" : "Avancer +10%"}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => archive(p.id)} aria-label={`Archiver ${p.name}`} className="h-8 w-8"><Archive /></Button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
}
