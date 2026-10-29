import { test } from "node:test";
import assert from "node:assert/strict";
import { projectSchema } from "./schemas.ts";

const valid = { name: "Campagne printemps", client: "Maison Arlo", type: "Campagne IA", budget: "12000", dueDate: "2026-12-01" };

test("accepte un projet valide et convertit le budget", () => {
  const r = projectSchema.safeParse(valid);
  assert.ok(r.success);
  assert.equal(r.data.budget, 12000);
});

test("rejette un nom trop court", () => {
  const r = projectSchema.safeParse({ ...valid, name: "ab" });
  assert.ok(!r.success);
  assert.equal(r.error.issues[0].path[0], "name");
});

test("rejette un budget sous le minimum", () => {
  const r = projectSchema.safeParse({ ...valid, budget: "100" });
  assert.ok(!r.success);
  assert.equal(r.error.issues[0].message, "Budget minimum 500 EUR");
});

test("rejette un type inconnu et une date vide", () => {
  const r = projectSchema.safeParse({ ...valid, type: "Autre", dueDate: "" });
  assert.ok(!r.success);
  const paths = r.error.issues.map((i) => i.path[0]);
  assert.ok(paths.includes("type") && paths.includes("dueDate"));
});
