import { test } from "node:test";
import assert from "node:assert/strict";
import { advanceProject, toggleCampaign, campaignActionLabel } from "./actions.ts";
import { projects, campaigns } from "./data.ts";

const base = projects[0];

test("advanceProject avance de 10 et passe en revue a 85+", () => {
  const p = advanceProject({ ...base, progress: 78, status: "En cours" });
  assert.equal(p.progress, 88);
  assert.equal(p.status, "Revue");
});

test("advanceProject plafonne a 100 et termine", () => {
  const p = advanceProject({ ...base, progress: 95, status: "Revue" });
  assert.equal(p.progress, 100);
  assert.equal(p.status, "Termine");
  assert.equal(advanceProject(p), p);
});

test("toggleCampaign: active <-> pause, brouillon lance, terminee inchangee", () => {
  const [active, , done, paused, draft] = campaigns;
  assert.equal(toggleCampaign(active).status, "En pause");
  assert.equal(toggleCampaign(paused).status, "Active");
  assert.equal(toggleCampaign(draft).status, "Active");
  assert.equal(toggleCampaign(done), done);
  assert.equal(campaignActionLabel(done), null);
  assert.equal(campaignActionLabel(active), "Mettre en pause");
});
