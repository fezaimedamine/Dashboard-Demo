import { z } from "zod";

export const formats = ["Post carre", "Story", "Banniere", "Video courte"] as const;
export const tones = ["Premium", "Audacieux", "Chaleureux", "Minimal"] as const;

export const briefSchema = z.object({
  prompt: z.string().trim().min(10, "Decrivez le brief en 10 caracteres minimum").max(400, "400 caracteres maximum"),
  format: z.enum(formats),
  tone: z.enum(tones),
});
export type Brief = z.infer<typeof briefSchema>;

export type Variant = { id: string; title: string; caption: string; score: number; hue: number; format: string };

const hooks: Record<(typeof tones)[number], string[]> = {
  Premium: ["L'excellence, sans compromis", "Concu pour durer", "Le detail qui change tout", "Une signature rare"],
  Audacieux: ["Osez la difference", "Plus fort, plus loin", "Brisez les codes", "Le futur commence ici"],
  Chaleureux: ["Fait pour vous", "Un moment a partager", "Simplement bien", "Tout pres de vous"],
  Minimal: ["L'essentiel", "Moins, mais mieux", "Pur et clair", "Rien de superflu"],
};

/** Deterministic demo generator: same brief and seed give the same variants. */
export function generateVariants(brief: Brief, seed: number): Variant[] {
  const subject = brief.prompt.split(/[.,;\n]/)[0].trim().slice(0, 48);
  return hooks[brief.tone].map((h, i) => {
    const n = (seed * 31 + i * 17 + brief.prompt.length) % 97;
    return {
      id: `${seed}-${i}`,
      title: h,
      caption: `${subject} - ${brief.format.toLowerCase()}, ton ${brief.tone.toLowerCase()}.`,
      score: 72 + (n % 26),
      hue: 210 + ((n * 7) % 40),
      format: brief.format,
    };
  });
}
