import type { Project, ProjectInput } from "./schemas";

export type ProjectFilter = "Tous" | Project["status"];

export function createProject(input: ProjectInput, id: string): Project {
  return { ...input, id, progress: 0, status: "Planifie", team: ["VO"] };
}

export function filterProjects(list: Project[], filter: ProjectFilter, query: string): Project[] {
  const q = query.trim().toLowerCase();
  return list.filter(
    (p) => (filter === "Tous" || p.status === filter) && (!q || p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q))
  );
}
