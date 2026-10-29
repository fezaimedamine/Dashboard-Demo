"use client";
import { useMemo, useState } from "react";
import { ArrowUpDown, Pause, Play } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import type { Campaign } from "@/lib/data";
import { campaignActionLabel } from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import { eur, num } from "@/lib/utils";

const tone = { Active: "green", "En pause": "amber", Terminee: "navy", Brouillon: "gray" } as const;
const filters = ["Toutes", "Active", "En pause", "Terminee"] as const;
type SortKey = "impressions" | "ctr" | "spend" | "roas";

export function CampaignsTable({ query, className = "lg:col-span-2" }: { query: string; className?: string }) {
  const { campaigns, toggle } = useAppStore();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Toutes");
  const [sort, setSort] = useState<SortKey>("impressions");
  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return campaigns
      .filter((c) => (filter === "Toutes" || c.status === filter) && (c.name.toLowerCase().includes(q) || c.channel.toLowerCase().includes(q)))
      .sort((a, b) => b[sort] - a[sort]);
  }, [campaigns, filter, sort, query]);

  const th = (k: SortKey, label: string) => (
    <th key={k} className="px-3 py-2.5 text-right font-medium">
      <button onClick={() => setSort(k)} className={`inline-flex cursor-pointer items-center gap-1 hover:text-navy-800 ${sort === k ? "text-navy-800" : ""}`}>{label}<ArrowUpDown className="size-3" /></button>
    </th>
  );

  return (
    <Card id="campaigns" className={className}>
      <CardHeader title="Campagnes IA recentes" description="Cliquez sur une colonne pour trier" action={<Segmented id="cf" options={filters} value={filter} onChange={setFilter} />} className="flex-wrap" />
      <div className="overflow-x-auto px-2 pb-3">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-xs text-navy-400">
              <th className="px-3 py-2.5 text-left font-medium">Campagne</th>
              <th className="px-3 py-2.5 text-left font-medium">Statut</th>
              {th("impressions", "Impressions")}
              {th("ctr", "CTR")}
              {th("spend", "Depense")}
              {th("roas", "ROAS")}
              <th className="px-3 py-2.5 text-right font-medium"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c: Campaign) => (
              <tr key={c.id} className="border-b border-navy-50 transition-colors last:border-0 hover:bg-navy-50/50">
                <td className="px-3 py-3"><p className="font-medium text-navy-900">{c.name}</p><p className="text-xs text-navy-400">{c.channel}</p></td>
                <td className="px-3 py-3"><Badge tone={tone[c.status]} dot>{c.status}</Badge></td>
                <td className="px-3 py-3 text-right tabular text-navy-700">{c.impressions ? num.format(c.impressions) : "-"}</td>
                <td className="px-3 py-3 text-right tabular text-navy-700">{c.ctr ? `${c.ctr.toFixed(1)} %` : "-"}</td>
                <td className="px-3 py-3 text-right tabular text-navy-700">{c.spend ? eur.format(c.spend) : "-"}</td>
                <td className="px-3 py-3 text-right"><span className={`tabular font-semibold ${c.roas >= 3 ? "text-emerald-600" : "text-navy-700"}`}>{c.roas ? `${c.roas.toFixed(1)}x` : "-"}</span></td>
                <td className="px-3 py-3 text-right">
                  {campaignActionLabel(c) && (
                    <Button size="sm" variant="outline" onClick={() => toggle(c.id)} aria-label={`${campaignActionLabel(c)} ${c.name}`}>
                      {c.status === "Active" ? <Pause /> : <Play />}{campaignActionLabel(c)}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-sm text-navy-400">Aucune campagne trouvee.</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
