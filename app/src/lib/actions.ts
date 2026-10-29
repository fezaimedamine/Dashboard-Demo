import type { Project } from "./schemas.ts";
import type { Campaign } from "./data.ts";

/** Advances a project by 10 points and derives its status. Finished projects stay unchanged. */
export function advanceProject(p: Project): Project {
  if (p.status === "Termine") return p;
  const progress = Math.min(100, p.progress + 10);
  const status: Project["status"] = progress === 100 ? "Termine" : progress >= 85 ? "Revue" : "En cours";
  return { ...p, progress, status };
}

/** Pauses an active campaign, resumes a paused one, launches a draft. Finished campaigns stay unchanged. */
export function toggleCampaign(c: Campaign): Campaign {
  if (c.status === "Active") return { ...c, status: "En pause" };
  if (c.status === "En pause" || c.status === "Brouillon") return { ...c, status: "Active" };
  return c;
}

export function campaignActionLabel(c: Campaign): string | null {
  return c.status === "Active" ? "Mettre en pause" : c.status === "En pause" ? "Reprendre" : c.status === "Brouillon" ? "Lancer" : null;
}
