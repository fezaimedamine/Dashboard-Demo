"use client";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart, PieChart, Pie, Cell } from "recharts";
import { Card, CardHeader } from "@/components/ui/card";
import { Segmented } from "@/components/ui/segmented";
import { performance, weekly, channelSplit } from "@/lib/data";
import { eur } from "@/lib/utils";

const ranges = ["7 jours", "12 mois"] as const;

export function PerformanceChart() {
  const [range, setRange] = useState<(typeof ranges)[number]>("12 mois");
  const data = range === "12 mois" ? performance : weekly;
  const total = data.reduce((s, d) => s + d.revenus, 0);
  return (
    <Card className="lg:col-span-2">
      <CardHeader title="Performance des campagnes" description="Revenus generes et taux de conversion" action={<Segmented id="range" options={ranges} value={range} onChange={setRange} />} />
      <div className="flex flex-wrap gap-6 px-5 pb-2">
        <Legend color="bg-navy-800" label="Revenus" value={eur.format(total)} />
        <Legend color="bg-accent" label="Conversion moy." value={`${(data.reduce((s, d) => s + d.conversion, 0) / data.length).toFixed(1)} %`} />
      </div>
      <div className="h-72 px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#172848" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#172848" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e3e9f5" strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6380b5", fontSize: 12 }} />
            <YAxis yAxisId="l" tickLine={false} axisLine={false} width={48} tick={{ fill: "#6380b5", fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
            <YAxis yAxisId="r" orientation="right" tickLine={false} axisLine={false} width={36} tick={{ fill: "#6380b5", fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              cursor={{ stroke: "#c3cfe6" }}
              contentStyle={{ borderRadius: 12, border: "1px solid #e3e9f5", boxShadow: "0 8px 24px -12px rgba(15,27,51,.25)", fontSize: 12 }}
              formatter={(v, n) => (n === "revenus" ? [eur.format(Number(v)), "Revenus"] : [`${v} %`, "Conversion"])}
            />
            <Area yAxisId="l" type="monotone" dataKey="revenus" stroke="#172848" strokeWidth={2} fill="url(#rev)" animationDuration={700} />
            <Line yAxisId="r" type="monotone" dataKey="conversion" stroke="#4f7cff" strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={700} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-navy-400"><span className={`size-2 rounded-full ${color}`} />{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-navy-900 tabular">{value}</p>
    </div>
  );
}

const pieColors = ["#172848", "#4f7cff", "#94a8cf", "#e3e9f5"];

export function ChannelChart() {
  return (
    <Card>
      <CardHeader title="Repartition par canal" description="Part du budget media - 30 jours" />
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={channelSplit} dataKey="value" innerRadius={58} outerRadius={80} paddingAngle={2} stroke="none" animationDuration={700}>
              {channelSplit.map((c, i) => <Cell key={c.name} fill={pieColors[i]} />)}
            </Pie>
            <Tooltip formatter={(v) => `${v} %`} contentStyle={{ borderRadius: 12, border: "1px solid #e3e9f5", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div><p className="text-xl font-semibold text-navy-900 tabular">38,4k</p><p className="text-[11px] text-navy-400">EUR investis</p></div>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-2 p-5 pt-2">
        {channelSplit.map((c, i) => (
          <li key={c.name} className="flex items-center justify-between rounded-lg bg-navy-50/60 px-3 py-2 text-xs">
            <span className="flex items-center gap-2 text-navy-600"><span className="size-2 rounded-full" style={{ background: pieColors[i] }} />{c.name}</span>
            <span className="font-semibold text-navy-900 tabular">{c.value}%</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export { AreaChart };
