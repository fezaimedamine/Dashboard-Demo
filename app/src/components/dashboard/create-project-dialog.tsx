"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, inputClass } from "@/components/ui/input";
import { Modal, ModalClose } from "@/components/ui/modal";
import { projectSchema, projectTypes, type ProjectInput } from "@/lib/schemas";
import { useAppStore } from "@/lib/store";

type Errors = Partial<Record<keyof ProjectInput, string>>;

export function CreateProjectDialog({ compact }: { compact?: boolean }) {
  const { addProject } = useAppStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = projectSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!res.success) {
      const errs: Errors = {};
      for (const issue of res.error.issues) errs[issue.path[0] as keyof ProjectInput] ??= issue.message;
      setErrors(errs);
      return;
    }
    setSaving(true);
    const ok = await addProject(res.data);
    setSaving(false);
    if (!ok) return;
    setErrors({});
    setOpen(false);
  }

  return (
    <Modal open={open} onOpenChange={(o) => { setOpen(o); if (!o) setErrors({}); }} title="Creer un projet"
      description="Le projet apparaitra immediatement dans la vue d'ensemble." trigger={<Button variant="accent" size={compact ? "sm" : "md"} aria-label="Nouveau projet"><Plus /><span className={compact ? "hidden sm:inline" : ""}>Nouveau projet</span></Button>}>
      <form onSubmit={submit} noValidate className="mt-5 space-y-4">
        <Field label="Nom du projet" htmlFor="name" error={errors.name}><Input id="name" name="name" placeholder="Ex. Campagne printemps" aria-invalid={!!errors.name} autoFocus /></Field>
        <Field label="Client" htmlFor="client" error={errors.client}><Input id="client" name="client" placeholder="Ex. Maison Arlo" aria-invalid={!!errors.client} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type" htmlFor="type" error={errors.type}>
            <select id="type" name="type" className={inputClass} defaultValue="Campagne IA">{projectTypes.map((t) => <option key={t}>{t}</option>)}</select>
          </Field>
          <Field label="Budget (EUR)" htmlFor="budget" error={errors.budget}><Input id="budget" name="budget" type="number" min={0} placeholder="12000" aria-invalid={!!errors.budget} /></Field>
        </div>
        <Field label="Echeance" htmlFor="dueDate" error={errors.dueDate}><Input id="dueDate" name="dueDate" type="date" aria-invalid={!!errors.dueDate} /></Field>
        <div className="flex justify-end gap-2 pt-2">
          <ModalClose asChild><Button type="button" variant="outline">Annuler</Button></ModalClose>
          <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Creer le projet"}</Button>
        </div>
      </form>
    </Modal>
  );
}
