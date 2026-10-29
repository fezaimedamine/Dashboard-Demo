import { z } from "zod";

export const projectTypes = ["Branding", "Video", "Campagne IA", "Web", "Social"] as const;

export const projectSchema = z.object({
  name: z.string().trim().min(3, "3 caracteres minimum").max(60, "60 caracteres maximum"),
  client: z.string().trim().min(2, "Client requis"),
  type: z.enum(projectTypes, { error: "Type invalide" }),
  budget: z.coerce.number({ error: "Montant invalide" }).min(500, "Budget minimum 500 EUR").max(1_000_000, "Budget trop eleve"),
  dueDate: z.iso.date({ error: "Date requise" }),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export type Project = ProjectInput & {
  id: string;
  progress: number;
  status: "En cours" | "Revue" | "Planifie" | "Termine";
  team: string[];
};
