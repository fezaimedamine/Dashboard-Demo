import type { Project, ProjectInput } from "./schemas.ts";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit, fetcher: typeof fetch = fetch): Promise<T> {
  let res: Response;
  try {
    res = await fetcher(`${API_URL}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  } catch {
    throw new ApiError(0, "API injoignable - verifiez que le backend tourne");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = typeof body?.detail === "string" ? body.detail : `Erreur ${res.status}`;
    throw new ApiError(res.status, detail);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const projectsApi = {
  list: (f?: typeof fetch) => request<Project[]>("/projects", undefined, f),
  create: (input: ProjectInput, f?: typeof fetch) => request<Project>("/projects", { method: "POST", body: JSON.stringify(input) }, f),
  update: (id: string, patch: Pick<Project, "progress" | "status">, f?: typeof fetch) =>
    request<Project>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(patch) }, f),
  remove: (id: string, f?: typeof fetch) => request<void>(`/projects/${id}`, { method: "DELETE" }, f),
};
