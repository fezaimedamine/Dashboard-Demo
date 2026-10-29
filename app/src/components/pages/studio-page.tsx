"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Wand2, Copy, Check, ImageIcon, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { Badge } from "@/components/ui/badge";
import { briefSchema, formats, tones, generateVariants, type Variant } from "@/lib/studio";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const examples = ["Lancement d'une montre connectee pour citadins actifs", "Collection hiver de the bio, ambiance cocooning", "Application de mobilite electrique, cible B2B"];

export function StudioPage() {
  const { log, notify } = useAppStore();
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState<(typeof formats)[number]>("Post carre");
  const [tone, setTone] = useState<(typeof tones)[number]>("Premium");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);
  const [seed, setSeed] = useState(1);

  function generate(e: React.FormEvent) {
    e.preventDefault();
    const res = briefSchema.safeParse({ prompt, format, tone });
    if (!res.success) { setError(res.error.issues[0].message); return; }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setVariants(generateVariants(res.data, seed));
      setSeed((s) => s + 1);
      setLoading(false);
      log({ action: "avez genere 4 variantes pour", target: res.data.prompt.slice(0, 40), kind: "ai" });
    }, 900);
  }

  function save(v: Variant) {
    setSaved((s) => new Set(s).add(v.id));
    notify(`"${v.title}" ajoute a la bibliotheque`);
  }

  async function copy(v: Variant) {
    await navigator.clipboard?.writeText(`${v.title}\n${v.caption}`).catch(() => undefined);
    setCopied(v.id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <>
      <PageHeader eyebrow="Studio IA" title="Generer des creations" description="Decrivez votre brief, l'assistant propose des accroches et visuels prets a decliner." />
      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Brief creatif" description="Format et ton de la campagne" />
          <form onSubmit={generate} noValidate className="space-y-4 p-5 pt-2">
            <Field label="Description" htmlFor="prompt" error={error ?? undefined}>
              <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={5} aria-invalid={!!error}
                placeholder="Ex. Lancement d'un parfum unisexe, univers nocturne et elegant..." className={cn(inputClass, "h-auto resize-none py-2.5")} />
            </Field>
            <div className="flex flex-wrap gap-1.5">
              {examples.map((x) => <button type="button" key={x} onClick={() => setPrompt(x)} className="cursor-pointer rounded-full bg-navy-50 px-2.5 py-1 text-[11px] text-navy-600 transition hover:bg-navy-100">{x.slice(0, 32)}...</button>)}
            </div>
            <div className="space-y-1.5"><p className="text-xs font-medium text-navy-700">Format</p>
              <select aria-label="Format" value={format} onChange={(e) => setFormat(e.target.value as typeof format)} className={inputClass}>{formats.map((f) => <option key={f}>{f}</option>)}</select>
            </div>
            <div className="space-y-1.5"><p className="text-xs font-medium text-navy-700">Ton</p><Segmented id="tone" options={tones} value={tone} onChange={setTone} /></div>
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : <Wand2 />}{loading ? "Generation..." : "Generer 4 variantes"}</Button>
          </form>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Variantes generees" description={variants.length ? `${variants.length} propositions - ${saved.size} enregistree(s)` : "Les resultats apparaitront ici"} />
          {variants.length === 0 && !loading ? (
            <div className="flex flex-col items-center gap-2 px-5 py-16 text-center text-sm text-navy-400"><Sparkles className="size-8 text-navy-200" />Remplissez le brief puis lancez la generation.</div>
          ) : (
            <div className="grid gap-3 p-5 pt-2 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {loading ? [0, 1, 2, 3].map((i) => <motion.div key={`s${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-56 animate-pulse rounded-xl bg-navy-50" />)
                  : variants.map((v, i) => (
                    <motion.article key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="overflow-hidden rounded-xl border border-navy-100">
                      <div className="relative grid h-32 place-items-center" style={{ background: `linear-gradient(135deg, hsl(${v.hue} 55% 14%), hsl(${v.hue + 12} 70% 45%))` }}>
                        <ImageIcon className="size-6 text-white/40" />
                        <span className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white">{v.title}</span>
                        <Badge tone="navy" className="absolute right-3 top-3 bg-white/15 ring-white/20">{v.format}</Badge>
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-2 text-xs text-navy-500">{v.caption}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[11px] text-navy-400">Score predit <b className="tabular text-navy-800">{v.score}</b>/100</span>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" aria-label="Copier" onClick={() => copy(v)}>{copied === v.id ? <Check /> : <Copy />}</Button>
                            <Button size="sm" variant={saved.has(v.id) ? "outline" : "primary"} disabled={saved.has(v.id)} onClick={() => save(v)}>{saved.has(v.id) ? "Enregistree" : "Enregistrer"}</Button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </section>
    </>
  );
}
