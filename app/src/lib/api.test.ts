import { test } from "node:test";
import assert from "node:assert/strict";
import { projectsApi, ApiError } from "./api.ts";

const fake = (status: number, body: unknown, seen: string[] = []) =>
  (async (url: string, init?: RequestInit) => {
    seen.push(`${init?.method ?? "GET"} ${url}`);
    return new Response(status === 204 ? null : JSON.stringify(body), { status });
  }) as unknown as typeof fetch;

test("create envoie un POST /projects et renvoie le projet", async () => {
  const seen: string[] = [];
  const p = await projectsApi.create({ name: "Abc", client: "Cl", type: "Web", budget: 900, dueDate: "2026-12-01" }, fake(201, { id: "x1" }, seen));
  assert.equal(p.id, "x1");
  assert.match(seen[0], /^POST .*\/projects$/);
});

test("erreur API: le detail du backend est remonte", async () => {
  await assert.rejects(projectsApi.remove("zz", fake(404, { detail: "Projet introuvable" })), (e: ApiError) => e.status === 404 && e.message === "Projet introuvable");
});

test("backend injoignable: message clair et status 0", async () => {
  const down = (async () => { throw new TypeError("fetch failed"); }) as unknown as typeof fetch;
  await assert.rejects(projectsApi.list(down), (e: ApiError) => e.status === 0 && /injoignable/.test(e.message));
});

test("DELETE 204 resout sans corps", async () => {
  assert.equal(await projectsApi.remove("p1", fake(204, null)), undefined);
});
