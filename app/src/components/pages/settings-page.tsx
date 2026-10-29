"use client";
import { useState } from "react";
import { profileSchema, fieldErrors } from "@/lib/forms";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, inputClass } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";


const notifDefs = [
  { id: "campaigns", label: "Alertes de performance", desc: "Quand un ROAS passe sous 2x" },
  { id: "comments", label: "Commentaires", desc: "Mentions et retours clients" },
  { id: "ai", label: "Generations IA terminees", desc: "Variantes et rendus prets" },
  { id: "digest", label: "Resume hebdomadaire", desc: "Chaque lundi a 9h" },
] as const;

export function SettingsPage() {
  const { notify } = useAppStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notifs, setNotifs] = useState<Record<string, boolean>>({ campaigns: true, comments: true, ai: false, digest: true });
  const [autoOpt, setAutoOpt] = useState(true);

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = profileSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!res.success) {
      setErrors(fieldErrors(res.error.issues));
      return;
    }
    setErrors({});
    notify("Profil enregistre");
  }

  return (
    <>
      <PageHeader eyebrow="Parametres" title="Parametres du compte" description="Profil, notifications et preferences de l'assistant IA." />
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Profil" description="Informations visibles par votre equipe" />
          <form onSubmit={save} noValidate className="grid gap-4 p-5 pt-2 sm:grid-cols-2">
            <Field label="Nom" htmlFor="s-name" error={errors.name}><Input id="s-name" name="name" defaultValue="Victor Olivier" aria-invalid={!!errors.name} /></Field>
            <Field label="Email" htmlFor="s-email" error={errors.email}><Input id="s-email" name="email" type="email" defaultValue="victor@nocturne.studio" aria-invalid={!!errors.email} /></Field>
            <Field label="Studio" htmlFor="s-company" error={errors.company}><Input id="s-company" name="company" defaultValue="Nocturne Studio" aria-invalid={!!errors.company} /></Field>
            <Field label="Langue" htmlFor="s-locale"><select id="s-locale" name="locale" className={inputClass} defaultValue="fr-FR"><option value="fr-FR">Francais</option><option value="en-GB">English</option></select></Field>
            <div className="flex justify-end sm:col-span-2"><Button type="submit"><Save />Enregistrer</Button></div>
          </form>
        </Card>
        <Card>
          <CardHeader title="Assistant IA" description="Automatisations des campagnes" />
          <div className="space-y-4 p-5 pt-2">
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-sm font-medium text-navy-900">Optimisation automatique</p><p className="text-xs text-navy-400">Ajuste les encheres en continu</p></div>
              <Switch label="Optimisation automatique" checked={autoOpt} onChange={(v) => { setAutoOpt(v); notify(v ? "Optimisation activee" : "Optimisation desactivee"); }} />
            </div>
            <div className="rounded-xl bg-navy-50 p-4 text-xs text-navy-500">Credits restants : <b className="tabular text-navy-900">2 580</b> sur 10 000 ce mois-ci.</div>
          </div>
        </Card>
      </section>
      <Card>
        <CardHeader title="Notifications" description="Choisissez ce qui merite votre attention" />
        <ul className="divide-y divide-navy-50 px-5 pb-2">
          {notifDefs.map((n) => (
            <li key={n.id} className="flex items-center justify-between gap-4 py-3.5">
              <div><p className="text-sm font-medium text-navy-900">{n.label}</p><p className="text-xs text-navy-400">{n.desc}</p></div>
              <Switch label={n.label} checked={notifs[n.id]} onChange={(v) => setNotifs((s) => ({ ...s, [n.id]: v }))} />
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
