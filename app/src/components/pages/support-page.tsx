"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { z } from "zod";
import { ticketSchema, fieldErrors } from "@/lib/forms";
import { ChevronDown, Send, BookOpen, MessageCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, inputClass } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const faq = [
  { q: "Comment sont calcules les credits IA ?", a: "Chaque generation de 4 variantes consomme 10 credits. Les videos courtes consomment 40 credits. Le compteur est remis a zero le 1er du mois." },
  { q: "Puis-je connecter mes comptes publicitaires ?", a: "Oui : Meta, Google Ads, TikTok, LinkedIn et Pinterest sont pris en charge depuis Parametres > Integrations." },
  { q: "Qui peut voir un projet ?", a: "Les membres assignes et les administrateurs du studio. Les clients recoivent un lien de revue en lecture seule." },
  { q: "Comment exporter un rapport de campagne ?", a: "Depuis la page Analytique, chaque graphique peut etre exporte en PNG ou CSV." },
];

type Ticket = z.infer<typeof ticketSchema> & { id: string };

export function SupportPage() {
  const { notify } = useAppStore();
  const [open, setOpen] = useState<number | null>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tickets, setTickets] = useState<Ticket[]>([{ id: "T-1042", subject: "Export CSV incomplet", priority: "Normale", message: "" }]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const res = ticketSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!res.success) {
      setErrors(fieldErrors(res.error.issues));
      return;
    }
    const id = `T-${1043 + tickets.length - 1}`;
    setTickets((t) => [{ ...res.data, id }, ...t]);
    setErrors({});
    form.reset();
    notify(`Ticket ${id} cree - reponse sous 4 h`);
  }

  return (
    <>
      <PageHeader eyebrow="Support" title="Centre d'aide" description="Questions frequentes et contact avec notre equipe." />
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { i: BookOpen, t: "Documentation", d: "Guides et tutoriels", go: () => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }) },
          { i: MessageCircle, t: "Chat en direct", d: "Lun-Ven, 9h-19h", go: () => { document.getElementById("t-subject")?.focus(); notify("Un conseiller vous repond via le formulaire de ticket"); } },
          { i: Clock, t: "Temps de reponse", d: "Moins de 4 h en moyenne", go: () => notify("Delai moyen constate ce mois-ci : 3 h 40") },
        ].map(({ i: Icon, t, d, go }) => (
          <button key={t} type="button" onClick={go} className="cursor-pointer text-left">
            <Card className="flex items-center gap-3 p-5 transition hover:-translate-y-0.5 hover:border-navy-200"><span className="grid size-10 place-items-center rounded-lg bg-navy-50 text-navy-700"><Icon className="size-4" /></span><div><p className="text-sm font-semibold text-navy-900">{t}</p><p className="text-xs text-navy-400">{d}</p></div></Card>
          </button>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <Card id="faq" className="lg:col-span-2">
          <CardHeader title="Questions frequentes" />
          <ul className="px-5 pb-3">
            {faq.map((f, i) => (
              <li key={f.q} className="border-b border-navy-50 last:border-0">
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full cursor-pointer items-center justify-between gap-4 py-3.5 text-left text-sm font-medium text-navy-900">
                  {f.q}<ChevronDown className={cn("size-4 shrink-0 text-navy-400 transition-transform", open === i && "rotate-180")} />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-3.5 text-sm text-navy-500">{f.a}</motion.p>}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Ouvrir un ticket" description="Notre equipe vous repond par email" />
          <form onSubmit={submit} noValidate className="space-y-4 p-5 pt-2">
            <Field label="Sujet" htmlFor="t-subject" error={errors.subject}><Input id="t-subject" name="subject" aria-invalid={!!errors.subject} /></Field>
            <Field label="Priorite" htmlFor="t-priority"><select id="t-priority" name="priority" defaultValue="Normale" className={inputClass}><option>Basse</option><option>Normale</option><option>Haute</option></select></Field>
            <Field label="Message" htmlFor="t-message" error={errors.message}><textarea id="t-message" name="message" rows={4} aria-invalid={!!errors.message} className={cn(inputClass, "h-auto resize-none py-2.5")} /></Field>
            <Button type="submit" className="w-full"><Send />Envoyer</Button>
          </form>
          <div className="border-t border-navy-50 p-5">
            <p className="mb-2 text-xs font-medium text-navy-400">Mes tickets</p>
            <ul className="space-y-2">{tickets.map((t) => <li key={t.id} className="flex items-center justify-between text-xs"><span className="truncate text-navy-700"><b className="tabular">{t.id}</b> {t.subject}</span><Badge tone={t.priority === "Haute" ? "amber" : "blue"}>Ouvert</Badge></li>)}</ul>
          </div>
        </Card>
      </section>
    </>
  );
}
