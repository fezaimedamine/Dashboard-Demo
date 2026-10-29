"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { activity as seedActivity, campaigns as seedCampaigns, type Campaign } from "./data";
import type { Project, ProjectInput } from "./schemas";
import { advanceProject, toggleCampaign } from "./actions";
import { projectsApi } from "./api";
import type { FeedItem } from "@/components/dashboard/activity-feed";

type Store = {
  projects: Project[];
  loading: boolean;
  loadError: string | null;
  reload: () => void;
  campaigns: Campaign[];
  feed: FeedItem[];
  unread: number;
  markAllRead: () => void;
  query: string;
  setQuery: (q: string) => void;
  addProject: (p: ProjectInput) => Promise<boolean>;
  advance: (id: string) => Promise<void>;
  archive: (id: string) => Promise<void>;
  toggle: (id: string) => void;
  log: (item: Omit<FeedItem, "id" | "time" | "who">) => void;
  notify: (msg: string) => void;
  toast: string | null;
};

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>(seedCampaigns);
  const [feed, setFeed] = useState<FeedItem[]>(seedActivity);
  const [unread, setUnread] = useState(3);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const log = useCallback((item: Omit<FeedItem, "id" | "time" | "who">) => {
    setFeed((f) => [{ ...item, id: `a${Date.now()}${Math.random()}`, who: "Vous", time: "a l'instant" }, ...f]);
    setUnread((n) => n + 1);
  }, []);

  const fetchProjects = useCallback(() => {
    projectsApi.list()
      .then((ps) => { setProjects(ps); setLoadError(null); })
      .catch((e: Error) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const addProject = useCallback(async (input: ProjectInput) => {
    try {
      const created = await projectsApi.create(input);
      setProjects((ps) => [created, ...ps]);
      log({ action: "avez cree le projet", target: input.name, kind: "create" });
      notify(`Projet "${input.name}" cree`);
      return true;
    } catch (e) {
      notify(`Echec de creation : ${(e as Error).message}`);
      return false;
    }
  }, [log, notify]);

  const advance = useCallback(async (id: string) => {
    const p = projects.find((x) => x.id === id);
    if (!p || p.status === "Termine") return;
    const next = advanceProject(p);
    try {
      const saved = await projectsApi.update(id, { progress: next.progress, status: next.status });
      setProjects((ps) => ps.map((x) => (x.id === id ? saved : x)));
      log({ action: saved.status === "Termine" ? "avez livre" : "avez fait avancer", target: p.name, kind: "done" });
      notify(`${p.name} : ${saved.progress}% (${saved.status})`);
    } catch (e) {
      notify(`Echec de mise a jour : ${(e as Error).message}`);
    }
  }, [projects, log, notify]);

  const archive = useCallback(async (id: string) => {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    try {
      await projectsApi.remove(id);
      setProjects((ps) => ps.filter((x) => x.id !== id));
      log({ action: "avez archive", target: p.name, kind: "upload" });
      notify(`Projet "${p.name}" archive`);
    } catch (e) {
      notify(`Echec de l'archivage : ${(e as Error).message}`);
    }
  }, [projects, log, notify]);

  const toggle = useCallback((id: string) => {
    const c = campaigns.find((x) => x.id === id);
    if (!c) return;
    const next = toggleCampaign(c);
    if (next === c) return;
    setCampaigns((cs) => cs.map((x) => (x.id === id ? next : x)));
    log({ action: next.status === "Active" ? "avez active la campagne" : "avez mis en pause", target: c.name, kind: "ai" });
    notify(`${c.name} : ${next.status}`);
  }, [campaigns, log, notify]);

  const markAllRead = useCallback(() => setUnread(0), []);

  const value = useMemo(
    () => ({ projects, loading, loadError, reload, campaigns, feed, unread, markAllRead, query, setQuery, addProject, advance, archive, toggle, log, notify, toast }),
    [projects, loading, loadError, reload, campaigns, feed, unread, markAllRead, query, addProject, advance, archive, toggle, log, notify, toast]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useAppStore must be used inside AppStoreProvider");
  return s;
}
