import { test } from "node:test";
import assert from "node:assert/strict";
import { inviteSchema, profileSchema, ticketSchema, initials, fieldErrors } from "./forms.ts";

test("invitation: email invalide et role inconnu rejetes", () => {
  const r = inviteSchema.safeParse({ name: "Lea Martin", email: "lea@", role: "Stagiaire" });
  assert.ok(!r.success);
  const e = fieldErrors(r.error.issues);
  assert.equal(e.email, "Email invalide");
  assert.ok(e.role);
  assert.ok(inviteSchema.safeParse({ name: "Lea Martin", email: "lea@nocturne.studio", role: "Design" }).success);
});

test("initiales calculees depuis le nom", () => {
  assert.equal(initials("  lea   martin dupont "), "LM");
});

test("profil: studio vide rejete", () => {
  const r = profileSchema.safeParse({ name: "Victor", email: "v@x.fr", company: "", locale: "fr-FR" });
  assert.ok(!r.success);
  assert.equal(fieldErrors(r.error.issues).company, "Studio requis");
});

test("ticket: message trop court rejete, premier message par champ conserve", () => {
  const r = ticketSchema.safeParse({ subject: "Bug", priority: "Normale", message: "court" });
  assert.ok(!r.success);
  const e = fieldErrors(r.error.issues);
  assert.deepEqual(Object.keys(e).sort(), ["message", "subject"]);
});
