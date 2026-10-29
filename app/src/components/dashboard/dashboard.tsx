"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { FolderKanban, Megaphone, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { StatCard } from "./stat-card";
import { PerformanceChart, ChannelChart } from "./performance-chart";
import { ProjectsOverview, type ProjectFilter } from "./projects-overview";
import { CampaignsTable } from "./campaigns-table";
import { ActivityFeed } from "./activity-feed";
import { CreateProjectDialog } from "./create-project-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { filterProjects } from "@/lib/projects";
import { useAppStore } from "@/lib/store";
import { eur } from "@/lib/utils";

export function Dashboard() {
  const { projects, feed, query, campaigns } = useAppStore();
  const [filter, setFilter] = useState<ProjectFilter>("Tous");
  const visible = useMemo(() => filterProjects(projects, filter, query).slice(0, 6), [projects, filter, query]);
  const active = projects.filter((p) => p.status !== "Termine").length;
  const budget = projects.reduce((s, p) => s + p.budget, 0);
  const live = campaigns.filter((c) => c.status === "Active").length;

  return (
    <>
      <PageHeader eyebrow="Vue d'ensemble" title="Bonjour Victor, voici votre studio" description={`${active} projets actifs et ${live} campagnes IA en diffusion cette semaine.`} action={<CreateProjectDialog />} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Projets actifs" value={String(active)} delta={12} icon={FolderKanban} hint="vs mois dernier" />
        <StatCard index={1} label="Budget engage" value={eur.format(budget)} delta={8.4} icon={Wallet} hint="vs mois dernier" />
        <StatCard index={2} label="Campagnes IA actives" value={String(live)} delta={-4} icon={Megaphone} hint="1 en pause" />
        <StatCard index={3} label="ROAS moyen" value="3,8x" delta={16.2} icon={TrendingUp} hint="sur 30 jours" />
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <PerformanceChart />
        <ChannelChart />
      </section>
      <ProjectsOverview projects={visible} filter={filter} onFilter={setFilter}
        footer={<Button asChild variant="ghost" size="sm"><Link href="/projets">Voir tous les projets<ArrowRight /></Link></Button>} />
      <section className="grid gap-6 lg:grid-cols-3">
        <CampaignsTable query={query} />
        <ActivityFeed items={feed} />
      </section>
    </>
  );
}
