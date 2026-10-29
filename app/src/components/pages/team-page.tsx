"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Users, Activity, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Segmented } from "@/components/ui/segmented";
import { Field, Input, inputClass } from "@/components/ui/input";
import { Modal, ModalClose } from "@/components/ui/modal";
import { StatCard } from "@/components/dashboard/stat-card";
import { team as seed, roles, type Member } from "@/lib/data";
import { useAppStore } from "@/lib/store";

import { inviteSchema, initials as toInitials, fieldErrors } from "@/lib/forms";
const filters = ["Tous", ...roles] as const;

export function TeamPage() {
  const { log, notify, query } = useAppStore();
  const [members, setMembers] = useState<Member[]>(seed);
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tous");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const q = query.toLowerCase();
  const rows = members.filter((m) => (filter === "Tous" || m.role === filter) && m.name.toLowerCase().includes(q));

  function invite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = inviteSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!res.success) {
      setErrors(fieldErrors(res.error.issues));
      return;
    }
    const initials = toInitials(res.data.name);
    setMembers((m) => [...m, { id: `m${Date.now()}`, ...res.data, initials, load: 0, projects: 0, status: "Invite" }]);
    log({ action: "avez invite", target: res.data.name, kind: "create" });
    notify(`Invitation envoyee a ${res.data.email}`);
    setErrors({});
    setOpen(false);
  }

  return (
    <>
      <PageHeader eyebrow="Equipe" title="Votre equipe creative" description="Roles, charge de travail et disponibilites."
        action={
          <Modal open={open} onOpenChange={(o) => { setOpen(o); if (!o) setErrors({}); }} title="Inviter un membre" description="Un email d'invitation sera envoye." trigger={<Button variant="accent"><UserPlus />Inviter</Button>}>
            <form onSubmit={invite} noValidate className="mt-5 space-y-4">
              <Field label="Nom complet" htmlFor="m-name" error={errors.name}><Input id="m-name" name="name" placeholder="Ex. Lea Martin" aria-invalid={!!errors.name} autoFocus /></Field>
              <Field label="Email" htmlFor="m-email" error={errors.email}><Input id="m-email" name="email" type="email" placeholder="lea@nocturne.studio" aria-invalid={!!errors.email} /></Field>
              <Field label="Role" htmlFor="m-role"><select id="m-role" name="role" className={inputClass}>{roles.map((r) => <option key={r}>{r}</option>)}</select></Field>
              <div className="flex justify-end gap-2 pt-2"><ModalClose asChild><Button type="button" variant="outline">Annuler</Button></ModalClose><Button type="submit">Envoyer</Button></div>
            </form>
          </Modal>
        } />
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard index={0} label="Membres" value={String(members.length)} delta={14} icon={Users} hint="ce trimestre" />
        <StatCard index={1} label="Charge moyenne" value={`${Math.round(members.reduce((s, m) => s + m.load, 0) / members.length)} %`} delta={4} icon={Activity} hint="cette semaine" />
        <StatCard index={2} label="Projets assignes" value={String(members.reduce((s, m) => s + m.projects, 0))} delta={9} icon={Briefcase} hint="en cours" />
      </section>
      <Segmented id="team-f" options={filters} value={filter} onChange={setFilter} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((m, i) => (
          <motion.div key={m.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-navy-800 to-accent text-sm font-semibold text-white">{m.initials}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-navy-900">{m.name}</p><p className="text-xs text-navy-400">{m.role}</p></div>
                <Badge tone={m.status === "Disponible" ? "green" : m.status === "Occupe" ? "amber" : "gray"} dot>{m.status}</Badge>
              </div>
              <div className="mt-4 flex justify-between text-xs"><span className="text-navy-400">Charge</span><span className="font-semibold tabular text-navy-800">{m.load}%</span></div>
              <Progress value={m.load} className="mt-1.5" />
              <div className="mt-4 flex items-center justify-between text-xs text-navy-400">
                <span>{m.projects} projet(s)</span>
                <Button asChild variant="ghost" size="sm"><a href={`mailto:${m.email}`}><Mail />Contacter</a></Button>
              </div>
            </Card>
          </motion.div>
        ))}
        {rows.length === 0 && <p className="col-span-full py-10 text-center text-sm text-navy-400">Aucun membre trouve.</p>}
      </div>
    </>
  );
}
