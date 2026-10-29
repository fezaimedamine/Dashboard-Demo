import { test } from "node:test";
import assert from "node:assert/strict";
import { briefSchema, generateVariants } from "./studio.ts";
import { createProject, filterProjects } from "./projects.ts";
import { projects } from "./data.ts";

const brief = { prompt: "Lancement d'une montre connectee, cible urbaine", format: "Story", tone: "Premium" } as const;

test("brief trop court rejete", () => {
  const r = briefSchema.safeParse({ ...brief, prompt: "court" });
  assert.ok(!r.success);
  assert.equal(r.error.issues[0].path[0], "prompt");
});

test("generation deterministe de 4 variantes avec score borne", () => {
  const a = generateVariants(brief, 3);
  assert.equal(a.length, 4);
  assert.deepEqual(a, generateVariants(brief, 3));
  for (const v of a) assert.ok(v.score >= 72 && v.score <= 97);
  assert.match(a[0].caption, /story/);
});

test("filterProjects combine statut et recherche", () => {
  assert.equal(filterProjects(projects, "Tous", "").length, projects.length);
  assert.ok(filterProjects(projects, "En cours", "").every((p) => p.status === "En cours"));
  assert.deepEqual(filterProjects(projects, "Tous", "atlas").map((p) => p.id), ["p3"]);
  assert.equal(filterProjects(projects, "Termine", "atlas").length, 0);
});

test("createProject demarre planifie a 0%", () => {
  const p = createProject({ name: "Test", client: "C", type: "Web", budget: 900, dueDate: "2026-12-01" }, "x");
  assert.equal(p.status, "Planifie");
  assert.equal(p.progress, 0);
});
