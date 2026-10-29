"use client";
import { useMemo, useState } from "react";
import { LayoutGrid, List, FolderKanban, Wallet, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { Segmented } from "@/components/ui/segmented";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProjectsOverview } from "@/components/dashboard/projects-overview";
import { filterProjects, type ProjectFilter } from "@/lib/projects";
import { useAppStore } from "@/lib/store";
import { eur } from "@/lib/utils";

const views = ["Grille", "Liste"] as const;
const filters = ["Tous", "En cours", "Revue", "Planifie", "Termine"] as const;
const tone = { "En cours": "blue", Revue: "amber", Planifie: "gray", Termine: "green" } as const;
const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export function ProjectsPage({ action }: { action: React.ReactNode }) {
  const { projects, query } = useAppStore();
  const [view, setView] = useState<(typeof views)[number]>("Grille");
  const [filter, setFilter] = useState<ProjectFilter>("Tous");
  const rows = useMemo(() => filterProjects(projects, filter, query), [projects, filter, query]);
  const budget = projects.reduce((s, p) => s + p.budget, 0);
  const avg = Math.round(projects.reduce((s, p) => s + p.progress, 0) / Math.max(projects.length, 1));

  return (
    <>
      <PageHeader eyebrow="Projets" title="Tous les projets creatifs" description="Suivez l'avancement, les budgets et les echeances de chaque production." action={action} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Projets au total" value={String(projects.length)} delta={9} icon={FolderKanban} hint="ce trimestre" />
        <StatCard index={1} label="Budget cumule" value={eur.format(budget)} delta={8.4} icon={Wallet} hint="vs trimestre dernier" />
        <StatCard index={2} label="Avancement moyen" value={`${avg} %`} delta={5} icon={Clock} hint="sur 30 jours" />
        <StatCard index={3} label="Livres" value={String(projects.filter((p) => p.status === "Termine").length)} delta={20} icon={CheckCircle2} hint="ce mois-ci" />
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented id="pp-filter" options={filters} value={filter} onChange={setFilter} />
        <div className="flex items-center gap-2 text-xs text-navy-400">
          <span className="tabular">{rows.length} resultat(s)</span>
          <Segmented id="pp-view" options={views} value={view} onChange={setView} />
          {view === "Grille" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
        </div>
      </div>
      {view === "Grille" ? (
        <ProjectsOverview projects={rows} hideFilter />
      ) : (
        <Card>
          <CardHeader title="Liste des projets" description="Trie par echeance" />
          <div className="overflow-x-auto px-2 pb-3">
            <table className="w-full min-w-[700px] text-sm">
              <thead><tr className="border-b border-navy-100 text-left text-xs text-navy-400">
                <th className="px-3 py-2.5 font-medium">Projet</th><th className="px-3 py-2.5 font-medium">Statut</th><th className="px-3 py-2.5 font-medium">Progression</th>
                <th className="px-3 py-2.5 font-medium">Equipe</th><th className="px-3 py-2.5 text-right font-medium">Budget</th><th className="px-3 py-2.5 text-right font-medium">Echeance</th>
              </tr></thead>
              <tbody>
                {[...rows].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((p) => (
                  <tr key={p.id} className="border-b border-navy-50 last:border-0 hover:bg-navy-50/50">
                    <td className="px-3 py-3"><p className="font-medium text-navy-900">{p.name}</p><p className="text-xs text-navy-400">{p.type} - {p.client}</p></td>
                    <td className="px-3 py-3"><Badge tone={tone[p.status]} dot>{p.status}</Badge></td>
                    <td className="w-48 px-3 py-3"><div className="flex items-center gap-2"><Progress value={p.progress} /><span className="w-9 text-xs tabular text-navy-600">{p.progress}%</span></div></td>
                    <td className="px-3 py-3"><AvatarStack initials={p.team} /></td>
                    <td className="px-3 py-3 text-right tabular text-navy-700">{eur.format(p.budget)}</td>
                    <td className="px-3 py-3 text-right text-navy-500">{dateFmt.format(new Date(p.dueDate))}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-navy-400">Aucun projet trouve.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
