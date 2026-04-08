"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle, ThumbsUp, FileText, Lightbulb,
  Layers, Info, ThumbsDown, CheckCircle2, Plus, Trash2,
  ChevronRight, Volume2, Upload, Lock, Clock, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { novaManifestacaoSchema, type NovaManifestacaoInput } from "@/lib/validations";
import {
  TIPO_MANIFESTACAO_LABELS,
  TIPO_MANIFESTACAO_DESCRICAO,
  TIPO_MANIFESTACAO_MICROCOPY,
  TIPO_MANIFESTACAO_COR,
} from "@/lib/manifestacao";

const TIPOS = [
  { key: "DENUNCIA",    icon: AlertTriangle },
  { key: "RECLAMACAO",  icon: ThumbsDown   },
  { key: "SOLICITACAO", icon: FileText      },
  { key: "SUGESTAO",    icon: Lightbulb    },
  { key: "ELOGIO",      icon: ThumbsUp     },
  { key: "INFORMACAO",  icon: Info          },
  { key: "SIMPLIFIQUE", icon: Layers        },
] as const;

const TIPOS_ROW1 = TIPOS.slice(0, 4);
const TIPOS_ROW2 = TIPOS.slice(4);

const TIPO_TITULO: Record<string, string> = {
  DENUNCIA:    "Faça sua denúncia",
  RECLAMACAO:  "Registre sua reclamação",
  SOLICITACAO: "Faça uma solicitação",
  SUGESTAO:    "Dê uma sugestão",
  ELOGIO:      "Registre um elogio",
  INFORMACAO:  "Solicite uma informação",
  SIMPLIFIQUE: "Indique simplificação",
};

const ESFERAS = ["Federal", "Estadual", "Municipal", "Distrital"];
const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold mb-4" style={{ color: "#1351B4" }}>
      {children}
    </h2>
  );
}

export default function NovaManifestacaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [protocolo, setProtocolo] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("");
  const [descricaoCount, setDescricaoCount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<NovaManifestacaoInput>({
    resolver: zodResolver(novaManifestacaoSchema) as any,
    defaultValues: { sigiloso: false, colaboradorOrgao: false, envolvidos: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "envolvidos" });
  const sigiloso         = watch("sigiloso");
  const colaboradorOrgao = watch("colaboradorOrgao");

  function selecionarTipo(tipo: string) {
    setTipoSelecionado(tipo);
    setValue("tipo", tipo as NovaManifestacaoInput["tipo"]);
  }

  async function onSubmit(data: NovaManifestacaoInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/manifestacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro ao registrar");
      setProtocolo(json.protocolo);
      toast.success("Manifestação registrada com sucesso!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const cor = tipoSelecionado
    ? (TIPO_MANIFESTACAO_COR as Record<string, string>)[tipoSelecionado]
    : "#1351B4";

  // ── Tela de sucesso ─────────────────────────────────────────────────────────
  if (protocolo) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#DAF0DD" }}>
              <CheckCircle2 className="w-11 h-11" style={{ color: "#168821" }} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "#1351B4" }}>Manifestação registrada!</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Sua manifestação foi registrada com sucesso. Guarde o protocolo abaixo para acompanhar o andamento.
            </p>
            <div className="bg-white border border-border rounded-2xl p-6 mb-6 shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Número de protocolo</p>
              <p className="text-3xl font-bold tracking-widest" style={{ color: "#1351B4" }}>{protocolo}</p>
              <p className="text-xs text-muted-foreground mt-3">
                Prazo de resposta: até <strong>20 dias úteis</strong>.
              </p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>Ver minhas manifestações</Button>
              <Button style={{ background: "#1351B4" }} onClick={() => { setProtocolo(""); setTipoSelecionado(""); }}>
                Nova manifestação
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
            <span>Início</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "#1351B4" }}>Nova Manifestação</span>
          </nav>

          {/* Seleção de tipo */}
          {!tipoSelecionado ? (
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: "#1351B4" }}>Como podemos te ajudar?</h1>
              <p className="text-sm text-muted-foreground mb-5">
                Escolha o que melhor descreve sua situação. Suas informações são protegidas —{" "}
                a ouvidoria responde em <strong>até 20 dias úteis</strong>.
              </p>

              {/* Bloco de confiança */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8 px-4 py-3 rounded-xl" style={{ background: "#EEF4FF", border: "1px solid #C7D7F5" }}>
                <div className="flex items-center gap-2 text-xs flex-1" style={{ color: "#0C326F" }}>
                  <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Sigilo garantido — dados protegidos por lei</span>
                </div>
                <div className="hidden sm:block w-px bg-[#C7D7F5]" />
                <div className="flex items-center gap-2 text-xs flex-1" style={{ color: "#0C326F" }}>
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Resposta em até 20 dias úteis</span>
                </div>
                <div className="hidden sm:block w-px bg-[#C7D7F5]" />
                <div className="flex items-center gap-2 text-xs flex-1" style={{ color: "#0C326F" }}>
                  <ClipboardList className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Acompanhe pelo protocolo, sem precisar ligar</span>
                </div>
              </div>

              {/* Row 1 — 4 cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TIPOS_ROW1.map(({ key, icon: Icon }) => {
                  const c = (TIPO_MANIFESTACAO_COR as Record<string, string>)[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selecionarTipo(key)}
                      className="bg-white rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md"
                      style={{ borderColor: "#E8EAF0" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = c; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8EAF0"; }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${c}18` }}>
                        <Icon className="w-5 h-5" style={{ color: c }} />
                      </div>
                      <p className="text-sm font-semibold text-[#1B1B1B]">
                        {(TIPO_MANIFESTACAO_LABELS as Record<string, string>)[key]}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">
                        {(TIPO_MANIFESTACAO_DESCRICAO as Record<string, string>)[key]}
                      </p>
                      <p className="text-xs mt-2 leading-snug font-medium" style={{ color: c }}>
                        {(TIPO_MANIFESTACAO_MICROCOPY as Record<string, string>)[key]}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Row 2 — 3 cards centralizados */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:w-[calc(75%-0.375rem)] sm:mx-auto">
                {TIPOS_ROW2.map(({ key, icon: Icon }) => {
                  const c = (TIPO_MANIFESTACAO_COR as Record<string, string>)[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selecionarTipo(key)}
                      className="bg-white rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md"
                      style={{ borderColor: "#E8EAF0" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = c; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8EAF0"; }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${c}18` }}>
                        <Icon className="w-5 h-5" style={{ color: c }} />
                      </div>
                      <p className="text-sm font-semibold text-[#1B1B1B]">
                        {(TIPO_MANIFESTACAO_LABELS as Record<string, string>)[key]}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">
                        {(TIPO_MANIFESTACAO_DESCRICAO as Record<string, string>)[key]}
                      </p>
                      <p className="text-xs mt-2 leading-snug font-medium" style={{ color: c }}>
                        {(TIPO_MANIFESTACAO_MICROCOPY as Record<string, string>)[key]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Header tipo selecionado */}
              <div className="rounded-2xl px-6 py-5 mb-6 flex items-center gap-4" style={{ background: `${cor}12`, border: `1.5px solid ${cor}30` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cor}20` }}>
                  <Volume2 className="w-6 h-6" style={{ color: cor }} />
                </div>
                <div>
                  <h1 className="text-xl font-bold" style={{ color: cor }}>{TIPO_TITULO[tipoSelecionado]}</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {(TIPO_MANIFESTACAO_DESCRICAO as Record<string, string>)[tipoSelecionado]}
                  </p>
                </div>
                <button type="button" className="ml-auto text-xs underline text-muted-foreground hover:text-foreground" onClick={() => setTipoSelecionado("")}>
                  Alterar
                </button>
              </div>

              {/* Seção: Sobre o que você quer falar */}
              <div className="bg-white rounded-2xl border border-[#E8EAF0] p-6 mb-4 shadow-sm">
                <SectionTitle>Sobre o que você quer falar</SectionTitle>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="assunto" className="text-sm font-medium">Assunto <span className="text-destructive">*</span></Label>
                    <Input id="assunto" placeholder="Resuma o assunto em poucas palavras" className="mt-1" {...register("assunto")} />
                    {errors.assunto && <p className="text-xs text-destructive mt-1">{errors.assunto.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="descricao" className="text-sm font-medium">
                      Descreva detalhadamente sua manifestação <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="descricao"
                      rows={7}
                      placeholder="Descreva detalhadamente sua manifestação..."
                      className="mt-1 resize-none"
                      {...register("descricao", { onChange: (e) => setDescricaoCount(e.target.value.length) })}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.descricao && <p className="text-xs text-destructive">{errors.descricao.message}</p>}
                      <p className="text-xs text-muted-foreground ml-auto">Limite máximo de <strong>8000</strong> caracteres ({descricaoCount}/8000)</p>
                    </div>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox checked={sigiloso} onCheckedChange={(v) => setValue("sigiloso", !!v)} className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Manifestação sigilosa</p>
                      <p className="text-xs text-muted-foreground">Seus dados pessoais não serão compartilhados com o órgão responsável.</p>
                    </div>
                  </label>
                  <div>
                    <Label className="text-sm font-medium">Anexar Arquivo (opcional)</Label>
                    <div className="mt-1 border-2 border-dashed border-[#C7D7F5] rounded-xl p-6 text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Escolher arquivo</p>
                      <p className="text-xs text-muted-foreground mt-1">Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: A demanda é para outra pessoa? */}
              <div className="bg-white rounded-2xl border border-[#E8EAF0] p-6 mb-4 shadow-sm">
                <SectionTitle>A demanda é para outra pessoa?</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="referidoNome" className="text-sm font-medium">Nome do referido</Label>
                    <Input id="referidoNome" placeholder="Informe o nome" className="mt-1" {...register("referidoNome")} />
                  </div>
                  <div>
                    <Label htmlFor="referidoCpf" className="text-sm font-medium">CPF</Label>
                    <Input id="referidoCpf" placeholder="000.000.000-00" className="mt-1" {...register("referidoCpf")} />
                  </div>
                  <div>
                    <Label htmlFor="referidoDataNasc" className="text-sm font-medium">Data de Nascimento</Label>
                    <Input id="referidoDataNasc" type="date" className="mt-1" {...register("referidoDataNasc")} />
                  </div>
                </div>
              </div>

              {/* Seção: Local do Fato */}
              <div className="bg-white rounded-2xl border border-[#E8EAF0] p-6 mb-4 shadow-sm">
                <SectionTitle>Local do Fato</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="localEsfera" className="text-sm font-medium">Esfera</Label>
                    <div className="relative mt-1">
                      <select id="localEsfera" className="w-full h-10 px-3 pr-8 rounded-md border border-input bg-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring" {...register("localEsfera")}>
                        <option value="">Selecione</option>
                        {ESFERAS.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">▾</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="localOrgao" className="text-sm font-medium">Órgão Responsável</Label>
                    <Input id="localOrgao" placeholder="Nome do órgão" className="mt-1" {...register("localOrgao")} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="localFato" className="text-sm font-medium">Local do fato</Label>
                    <Input id="localFato" placeholder="Informe o endereço ou local" className="mt-1" {...register("localFato")} />
                  </div>
                  <div>
                    <Label htmlFor="localMunicipio" className="text-sm font-medium">Município</Label>
                    <Input id="localMunicipio" placeholder="Informe o município" className="mt-1" {...register("localMunicipio")} />
                  </div>
                  <div>
                    <Label htmlFor="localEstado" className="text-sm font-medium">Estado</Label>
                    <div className="relative mt-1">
                      <select id="localEstado" className="w-full h-10 px-3 pr-8 rounded-md border border-input bg-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring" {...register("localEstado")}>
                        <option value="">Selecione</option>
                        {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">▾</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Envolvidos */}
              <div className="bg-white rounded-2xl border border-[#E8EAF0] p-6 mb-4 shadow-sm">
                <SectionTitle>Quais são os envolvidos no fato?</SectionTitle>
                {fields.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 bg-[#F8F8F8] rounded-xl mb-4">Nenhum envolvido adicionado</p>
                ) : (
                  <div className="space-y-4 mb-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="bg-[#F8F8F8] rounded-xl p-4 relative">
                        <button type="button" onClick={() => remove(index)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium">Nome do Envolvido</Label>
                            <Input placeholder="Informe o nome" className="mt-1 h-9 text-sm" {...register(`envolvidos.${index}.nome`)} />
                          </div>
                          <div>
                            <Label className="text-xs font-medium">CPF</Label>
                            <Input placeholder="000.000.000-00" className="mt-1 h-9 text-sm" {...register(`envolvidos.${index}.cpf`)} />
                          </div>
                          <div>
                            <Label className="text-xs font-medium">Esfera</Label>
                            <div className="relative mt-1">
                              <select className="w-full h-9 px-3 pr-8 rounded-md border border-input bg-white text-sm appearance-none" {...register(`envolvidos.${index}.esfera`)}>
                                <option value="">Selecione</option>
                                {ESFERAS.map((e) => <option key={e} value={e}>{e}</option>)}
                              </select>
                              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">▾</span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs font-medium">Órgão Responsável</Label>
                            <Input placeholder="Nome do órgão" className="mt-1 h-9 text-sm" {...register(`envolvidos.${index}.orgao`)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  type="button" variant="outline" size="sm" className="gap-2"
                  style={{ color: "#1351B4", borderColor: "#1351B4" }}
                  onClick={() => append({ nome: "", cpf: "", esfera: "", orgao: "" })}
                >
                  <Plus className="w-4 h-4" /> Adicionar
                </Button>
              </div>

              {/* Seção: Para qual Ouvidoria? */}
              <div className="bg-white rounded-2xl border border-[#E8EAF0] p-6 mb-4 shadow-sm">
                <SectionTitle>Para qual Ouvidoria você quer enviar sua manifestação?</SectionTitle>
                <div className="rounded-xl p-4 mb-4 flex gap-3" style={{ background: "#EEF4FF", border: "1px solid #C7D7F5" }}>
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1351B4" }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#1351B4" }}>
                    Em caso de dúvida, selecione <strong>Esfera Federal</strong>. Nós encaminharemos sua manifestação para o órgão responsável.
                  </p>
                </div>
                <div className="w-48 mb-5">
                  <Label htmlFor="ouvidoriaEsfera" className="text-sm font-medium">Esfera</Label>
                  <div className="relative mt-1">
                    <select id="ouvidoriaEsfera" className="w-full h-10 px-3 pr-8 rounded-md border border-input bg-background text-sm appearance-none" {...register("ouvidoriaEsfera")}>
                      <option value="">Selecione</option>
                      {ESFERAS.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">▾</span>
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={colaboradorOrgao} onCheckedChange={(v) => setValue("colaboradorOrgao", !!v)} className="mt-0.5" />
                  <p className="text-sm">O manifestante é colaborador do órgão destinatário da manifestação?</p>
                </label>
              </div>

              {/* Botões */}
              <div className="flex gap-3 justify-end mt-6">
                <Button type="button" variant="outline" onClick={() => setTipoSelecionado("")}>Voltar</Button>
                <Button type="submit" disabled={loading} className="gap-2 font-semibold px-8" style={{ background: "#1351B4" }}>
                  {loading ? "Registrando..." : "Concluir"}
                  {!loading && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
