import type { Project } from "./schemas";

export const projects: Project[] = [
  { id: "p1", name: "Refonte identite Lumen", client: "Lumen Paris", type: "Branding", budget: 24000, dueDate: "2026-11-18", progress: 72, status: "En cours", team: ["CL", "MB", "YA"] },
  { id: "p2", name: "Spot genere IA - Hiver", client: "Maison Arlo", type: "Video", budget: 41500, dueDate: "2026-12-02", progress: 45, status: "En cours", team: ["SD", "KT"] },
  { id: "p3", name: "Lancement Atlas One", client: "Atlas Mobility", type: "Campagne IA", budget: 68000, dueDate: "2026-11-07", progress: 88, status: "Revue", team: ["CL", "NR", "PB", "YA"] },
  { id: "p4", name: "Site vitrine Oriel", client: "Oriel Studio", type: "Web", budget: 18200, dueDate: "2027-01-15", progress: 12, status: "Planifie", team: ["MB"] },
  { id: "p5", name: "Serie TikTok Verde", client: "Verde Cosmetics", type: "Social", budget: 9600, dueDate: "2026-10-30", progress: 100, status: "Termine", team: ["KT", "SD"] },
  { id: "p6", name: "Packaging Nordlys", client: "Nordlys Tea", type: "Branding", budget: 15800, dueDate: "2026-12-20", progress: 34, status: "En cours", team: ["PB", "NR"] },
];

export type Campaign = {
  id: string;
  name: string;
  channel: string;
  status: "Active" | "En pause" | "Terminee" | "Brouillon";
  impressions: number;
  ctr: number;
  spend: number;
  roas: number;
};

export const campaigns: Campaign[] = [
  { id: "c1", name: "Atlas One - Teaser genere", channel: "Meta Ads", status: "Active", impressions: 1_284_000, ctr: 3.4, spend: 12400, roas: 4.2 },
  { id: "c2", name: "Arlo Hiver - Video IA", channel: "YouTube", status: "Active", impressions: 862_300, ctr: 2.1, spend: 9800, roas: 3.1 },
  { id: "c3", name: "Verde - UGC synthetique", channel: "TikTok", status: "Terminee", impressions: 2_045_900, ctr: 4.8, spend: 7600, roas: 5.6 },
  { id: "c4", name: "Lumen - Retargeting", channel: "Google Ads", status: "En pause", impressions: 318_400, ctr: 1.7, spend: 3200, roas: 2.4 },
  { id: "c5", name: "Nordlys - Visuels saison", channel: "Pinterest", status: "Brouillon", impressions: 0, ctr: 0, spend: 0, roas: 0 },
  { id: "c6", name: "Atlas One - LinkedIn B2B", channel: "LinkedIn", status: "Active", impressions: 204_700, ctr: 1.2, spend: 5400, roas: 2.9 },
];

const months = ["Nov", "Dec", "Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct"];
const rev = [38, 42, 35, 47, 52, 49, 58, 63, 60, 71, 76, 84];
const conv = [1.9, 2.1, 1.8, 2.4, 2.6, 2.5, 2.9, 3.1, 3.0, 3.4, 3.6, 3.9];
export const performance = months.map((m, i) => ({ label: m, revenus: rev[i] * 1000, conversion: conv[i] }));

export const weekly = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d, i) => ({
  label: d,
  revenus: [6.2, 7.1, 6.8, 8.4, 9.1, 5.2, 4.8][i] * 1000,
  conversion: [3.2, 3.5, 3.4, 3.9, 4.1, 3.0, 2.8][i],
}));

export const channelSplit = [
  { name: "Meta", value: 34 },
  { name: "TikTok", value: 26 },
  { name: "YouTube", value: 21 },
  { name: "Autres", value: 19 },
];

export type Activity = { id: string; who: string; action: string; target: string; time: string; kind: "ai" | "comment" | "upload" | "done" };

export const activity: Activity[] = [
  { id: "a1", who: "Claire Lemoine", action: "a valide les visuels de", target: "Lancement Atlas One", time: "il y a 12 min", kind: "done" },
  { id: "a2", who: "Assistant IA", action: "a genere 24 variantes pour", target: "Arlo Hiver - Video IA", time: "il y a 38 min", kind: "ai" },
  { id: "a3", who: "Samir Dahan", action: "a commente le storyboard de", target: "Spot genere IA - Hiver", time: "il y a 1 h", kind: "comment" },
  { id: "a4", who: "Karine Tessier", action: "a importe 18 fichiers dans", target: "Packaging Nordlys", time: "il y a 3 h", kind: "upload" },
  { id: "a5", who: "Assistant IA", action: "a optimise les enchères de", target: "Atlas One - LinkedIn B2B", time: "hier", kind: "ai" },
];

export const roles = ["Direction artistique", "Design", "Motion", "Media", "Prompt engineer"] as const;
export type Member = { id: string; name: string; email: string; role: (typeof roles)[number]; initials: string; load: number; projects: number; status: "Disponible" | "Occupe" | "Invite" };

export const team: Member[] = [
  { id: "m1", name: "Claire Lemoine", email: "claire@nocturne.studio", role: "Direction artistique", initials: "CL", load: 82, projects: 3, status: "Occupe" },
  { id: "m2", name: "Mathis Bernard", email: "mathis@nocturne.studio", role: "Design", initials: "MB", load: 64, projects: 2, status: "Disponible" },
  { id: "m3", name: "Yasmine Amrani", email: "yasmine@nocturne.studio", role: "Prompt engineer", initials: "YA", load: 71, projects: 2, status: "Disponible" },
  { id: "m4", name: "Samir Dahan", email: "samir@nocturne.studio", role: "Motion", initials: "SD", load: 90, projects: 2, status: "Occupe" },
  { id: "m5", name: "Karine Tessier", email: "karine@nocturne.studio", role: "Motion", initials: "KT", load: 58, projects: 2, status: "Disponible" },
  { id: "m6", name: "Nora Roussel", email: "nora@nocturne.studio", role: "Media", initials: "NR", load: 47, projects: 2, status: "Disponible" },
  { id: "m7", name: "Paul Blanc", email: "paul@nocturne.studio", role: "Design", initials: "PB", load: 76, projects: 2, status: "Occupe" },
];
