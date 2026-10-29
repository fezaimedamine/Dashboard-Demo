"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Megaphone, Eye, MousePointerClick, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { CampaignsTable } from "@/components/dashboard/campaigns-table";
import { ChannelChart } from "@/components/dashboard/performance-chart";
import { useAppStore } from "@/lib/store";
import { eur, num } from "@/lib/utils";
import { tooltipStyle } from "@/components/dashboard/chart-theme";

export function CampaignsPage() {
  const { query, campaigns } = useAppStore();
  const live = campaigns.filter((c) => c.status === "Active");
  const impressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const spend = campaigns.reduce((s, c) => s + c.spend, 0);
  const withData = campaigns.filter((c) => c.ctr > 0);
  const ctr = withData.reduce((s, c) => s + c.ctr, 0) / withData.length;
  const roasData = withData.map((c) => ({ name: c.name.split(" - ")[0], roas: c.roas, id: c.id }));

  return (
    <>
      <PageHeader eyebrow="Campagnes IA" title="Campagnes et diffusion" description="Performances des creations generees par IA sur chaque canal." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Campagnes actives" value={String(live.length)} delta={-4} icon={Megaphone} hint={`sur ${campaigns.length}`} />
        <StatCard index={1} label="Impressions" value={num.format(impressions)} delta={22} icon={Eye} hint="30 jours" />
        <StatCard index={2} label="CTR moyen" value={`${ctr.toFixed(1)} %`} delta={6.1} icon={MousePointerClick} hint="vs mois dernier" />
        <StatCard index={3} label="Depense media" value={eur.format(spend)} delta={11} icon={Wallet} hint="30 jours" />
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="ROAS par campagne" description="Retour sur depense publicitaire (x)" />
          <div className="h-72 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roasData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e3e9f5" strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#6380b5", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} width={36} tick={{ fill: "#6380b5", fontSize: 12 }} tickFormatter={(v) => `${v}x`} />
                <Tooltip cursor={{ fill: "#f2f5fb" }} contentStyle={tooltipStyle} formatter={(v) => [`${v}x`, "ROAS"]} />
                <Bar dataKey="roas" fill="#172848" radius={[6, 6, 0, 0]} maxBarSize={44} animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <ChannelChart />
      </section>
      <CampaignsTable query={query} className="" />
    </>
  );
}
