"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, Target, Timer, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/stat-card";
import { PerformanceChart, ChannelChart } from "@/components/dashboard/performance-chart";
import { tooltipStyle, axisTick } from "@/components/dashboard/chart-theme";
import { useAppStore } from "@/lib/store";
import { eur } from "@/lib/utils";

const funnel = [
  { step: "Impressions", value: 100 },
  { step: "Clics", value: 38 },
  { step: "Leads", value: 14 },
  { step: "Ventes", value: 4.2 },
];

export function AnalyticsPage() {
  const { projects } = useAppStore();
  const byType = Object.entries(projects.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.type]: (acc[p.type] ?? 0) + p.budget }), {}))
    .map(([type, budget]) => ({ type, budget })).sort((a, b) => b.budget - a.budget);

  return (
    <>
      <PageHeader eyebrow="Analytique" title="Analyse de performance" description="Revenus, conversion et rentabilite par type de production." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Revenus 12 mois" value={eur.format(675000)} delta={18.6} icon={TrendingUp} hint="vs annee N-1" />
        <StatCard index={1} label="Taux de conversion" value="3,9 %" delta={8.3} icon={Target} hint="oct." />
        <StatCard index={2} label="Delai moyen de livraison" value="18 j" delta={-12} icon={Timer} hint="plus rapide" />
        <StatCard index={3} label="Contenus generes IA" value="1 284" delta={34} icon={Sparkles} hint="ce mois-ci" />
      </section>
      <section className="grid gap-6 lg:grid-cols-3"><PerformanceChart /><ChannelChart /></section>
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Budget par type de projet" description="Somme des budgets engages" />
          <div className="h-64 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="#e3e9f5" strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={axisTick} tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis type="category" dataKey="type" tickLine={false} axisLine={false} tick={axisTick} width={96} />
                <Tooltip cursor={{ fill: "#f2f5fb" }} contentStyle={tooltipStyle} formatter={(v) => [eur.format(Number(v)), "Budget"]} />
                <Bar dataKey="budget" fill="#4f7cff" radius={[0, 6, 6, 0]} maxBarSize={26} animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Entonnoir de conversion" description="Pour 100 impressions qualifiees" />
          <ul className="space-y-4 p-5 pt-2">
            {funnel.map((f) => (
              <li key={f.step}>
                <div className="mb-1.5 flex justify-between text-xs"><span className="text-navy-500">{f.step}</span><span className="font-semibold tabular text-navy-900">{f.value} %</span></div>
                <Progress value={f.value} />
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </>
  );
}
