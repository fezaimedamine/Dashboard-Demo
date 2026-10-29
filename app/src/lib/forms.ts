import { z } from "zod";
import { roles } from "./data.ts";

export const inviteSchema = z.object({
  name: z.string().trim().min(2, "Nom requis"),
  email: z.email("Email invalide"),
  role: z.enum(roles),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Nom requis"),
  email: z.email("Email invalide"),
  company: z.string().trim().min(2, "Studio requis"),
  locale: z.enum(["fr-FR", "en-GB"]),
});

export const ticketSchema = z.object({
  subject: z.string().trim().min(5, "5 caracteres minimum"),
  priority: z.enum(["Basse", "Normale", "Haute"]),
  message: z.string().trim().min(20, "Detaillez votre demande (20 caracteres minimum)"),
});

export function initials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const errs: Record<string, string> = {};
  for (const i of issues) errs[String(i.path[0])] ??= i.message;
  return errs;
}
