"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2, Clock, AlertTriangle, ChevronLeft,
  ExternalLink, Star, Upload,
} from "lucide-react";
import { toast } from "sonner";
import { TIPO_MANIFESTACAO_LABELS, STATUS_LABELS } from "@/lib/manifestacao";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type M = any;

function StatusBanner({ status, prazoLegal, dataResposta }: { status: string; prazoLegal?: string; dataResposta?: string }) {
  const done = ["RESPONDIDA", "ENCERRADA"].includes(status);
  const cancelled = status === "CANCELADA";
  if (done) return (
    <div className="rounded-xl p-4 mb-6 flex gap-3 items-start" style={{ background: "#DAF0DD", border: "1px solid #A9D5AC" }}>
      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#168821" }} />
      <div>
        <p className="font-semibold text-sm" style={{ color: "#168821" }}>Manifestação concluída</p>
        {dataResposta && <p className="text-xs mt-0.5" style={{ color: "#0F6518" }}>Sua manifestação foi respondida em {format(new Date(dataResposta), "dd/MM/yyyy", { locale: ptBR })}.</p>}
      </div>
    </div>
  );
  if (cancelled) return (
    <div className="rounded-xl p-4 mb-6 flex gap-3 items-start" style={{ background: "#FDE0DB", border: "1px solid #F5A89E" }}>
      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#E52207" }} />
      <p className="font-semibold text-sm" style={{ color: "#E52207" }}>Manifestação cancelada</p>
    </div>
  );
  return (
    <div className="rounded-xl p-4 mb-6 flex gap-3 items-start" style={{ background: "#EEF4FF", border: "1px solid #C7D7F5" }}>
      <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1351B4" }} />
      <div>
        <p className="font-semibold text-sm" style={{ color: "#1351B4" }}>{(STATUS_LABELS as Record<string, string>)[status] ?? status}</p>
        {prazoLegal && <p className="text-xs mt-0.5" style={{ color: "#0C326F" }}>Estamos analisando sua manifestação. Prazo estimado para resposta {format(new Date(prazoLegal), "dd/MM/yyyy", { locale: ptBR })}.</p>}
      </div>
    </div>
  );
}

function TimelineDot({ color, last }: { color: string; last?: boolean }) {
  return (
    <div className="relative flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
      <div className="w-5 h-5 rounded-full border-2 border-white z-10" style={{ background: color, boxShadow: `0 0 0 3px ${color}30` }} />
      {!last && <div className="flex-1 w-0.5 mt-1" style={{ background: "#E0E0E0", minHeight: 40 }} />}
    </div>
  );
}

export default function ManifestacaoDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const [m, setM]           = useState<M>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro]     = useState("");

  const [compTxt, setCompTxt]       = useState("");
  const [enviandoComp, setEnviandoComp] = useState(false);

  const [nota, setNota]             = useState(0);
  const [avalTxt, setAvalTxt]       = useState("");
  const [enviandoAval, setEnviandoAval] = useState(false);

  async function load() {
    try {
      const res = await fetch(`/api/manifestacoes/${params.id}`);
      if (!res.ok) { setErro((await res.json()).error ?? "Não encontrada"); return; }
      setM(await res.json());
    } catch { setErro("Erro ao carregar."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (params.id) load(); }, [params.id]);

  async function enviarComplemento() {
    if (!compTxt.trim()) return;
    setEnviandoComp(true);
    try {
      const res = await fetch(`/api/manifestacoes/${params.id}/complemento`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: compTxt }) });
      if (!res.ok) throw new Error();
      toast.success("Complemento enviado!");
      setCompTxt("");
      await load();
    } catch { toast.error("Erro ao enviar."); }
    finally { setEnviandoComp(false); }
  }

  async function enviarAvaliacao() {
    if (!nota) { toast.error("Selecione uma nota."); return; }
    setEnviandoAval(true);
    try {
      const res = await fetch(`/api/manifestacoes/${params.id}/avaliacao`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nota, texto: avalTxt }) });
      if (!res.ok) throw new Error();
      toast.success("Avaliação enviada! Obrigado.");
      await load();
    } catch { toast.error("Erro ao avaliar."); }
    finally { setEnviandoAval(false); }
  }

  if (loading) return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1351B4] border-t-transparent rounded-full animate-spin" />
      </main>
      <Footer />
    </div>
  );

  if (erro || !m) return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{erro || "Não encontrada."}</p>
          <Button onClick={() => router.push("/dashboard")} style={{ background: "#1351B4" }}>Voltar ao painel</Button>
        </div>
      </main>
      <Footer />
    </div>
  );

  const isConcluida   = ["RESPONDIDA", "ENCERRADA"].includes(m.status);
  const respostaFinal = m.respostas?.find((r: M) => r.tipo === "FINAL") ?? m.respostas?.[0];
  const jaAvaliou     = !!m.avaliacao;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Topbar */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />Voltar
            </button>
            <Link href="/nova-manifestacao">
              <Button variant="outline" size="sm" className="gap-2 border-[#1351B4] text-[#1351B4] hover:bg-[#EEF4FF]">
                Nova manifestação <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Card principal */}
          <div className="bg-white rounded-2xl border border-[#E8EAF0] p-6 mb-6 shadow-sm">

            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 rounded-full bg-[#1351B4]" />
              <h1 className="text-lg font-bold text-[#1B1B1B]">
                Manifestação {m.protocolo.slice(0, 8) + "/" + m.protocolo.slice(8, 10)}
              </h1>
            </div>
            <div className="ml-3 space-y-0.5 mb-5">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-[#1B1B1B]">Tipo:</span>{" "}
                {(TIPO_MANIFESTACAO_LABELS as Record<string, string>)[m.tipo]}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-[#1B1B1B]">Data de Abertura:</span>{" "}
                {format(new Date(m.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                {m.prazoLegal && (
                  <> {"  "}<span className="font-medium text-[#1B1B1B]">Prazo para resposta:</span>{" "}
                    <span style={{ color: "#1351B4" }}>{format(new Date(m.prazoLegal), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </>
                )}
              </p>
            </div>

            <StatusBanner status={m.status} prazoLegal={m.prazoLegal} dataResposta={m.dataResposta ?? respostaFinal?.createdAt} />

            {/* Timeline */}
            <div>
              {/* Abertura */}
              <div className="flex gap-4">
                <TimelineDot color="#1351B4" />
                <div className="flex-1 pb-6">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "#1351B4" }}>Abertura da Manifestação</p>
                  <p className="text-xs text-muted-foreground mb-3">Em {format(new Date(m.createdAt), "dd/MM/yyyy - HH'h'mm", { locale: ptBR })}</p>
                  <div className="bg-[#F8F8F8] rounded-xl p-4">
                    <p className="text-sm text-[#1B1B1B] leading-relaxed whitespace-pre-wrap">{m.descricao}</p>
                  </div>
                </div>
              </div>

              {/* Complementos */}
              {m.complementos?.map((c: M) => (
                <div key={c.id} className="flex gap-4">
                  <TimelineDot color="#9B59B6" />
                  <div className="flex-1 pb-6">
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "#9B59B6" }}>Complemento enviado</p>
                    <p className="text-xs text-muted-foreground mb-3">Em {format(new Date(c.createdAt), "dd/MM/yyyy - HH'h'mm", { locale: ptBR })}</p>
                    <div className="bg-[#F8F8F8] rounded-xl p-4">
                      <p className="text-sm text-[#1B1B1B] leading-relaxed whitespace-pre-wrap">{c.texto}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Resposta */}
              {respostaFinal && (
                <div className="flex gap-4">
                  <TimelineDot color="#168821" last />
                  <div className="flex-1 pb-2">
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "#168821" }}>Resposta da Ouvidoria</p>
                    <p className="text-xs text-muted-foreground mb-3">Em {format(new Date(respostaFinal.createdAt), "dd/MM/yyyy - HH'h'mm", { locale: ptBR })}</p>
                    <div className="rounded-xl p-4" style={{ background: "#F1F9F1", border: "1px solid #A9D5AC" }}>
                      <p className="text-sm text-[#1B1B1B] leading-relaxed whitespace-pre-wrap">{respostaFinal.conteudo}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form complemento */}
              {!isConcluida && (
                <div className="flex gap-4 mt-2">
                  <div className="w-5 flex-shrink-0 flex items-start justify-center pt-1">
                    <div className="w-5 h-5 rounded-full" style={{ background: "#C2850C", boxShadow: "0 0 0 3px #C2850C30" }} />
                  </div>
                  <div className="flex-1 rounded-xl overflow-hidden" style={{ border: "1px solid #F0D080" }}>
                    <div className="px-4 py-3" style={{ background: "#FFF5C2" }}>
                      <p className="text-sm font-semibold" style={{ color: "#7A5800" }}>Complementar Manifestação</p>
                    </div>
                    <div className="p-4 bg-white">
                      <Textarea placeholder="Descreva as informações complementares." rows={4} className="resize-none mb-2" value={compTxt} onChange={(e) => setCompTxt(e.target.value)} />
                      <p className="text-xs text-muted-foreground mb-3">Limite máximo de 8000 caracteres</p>
                      <div className="border-2 border-dashed border-[#E8EAF0] rounded-xl p-4 text-center">
                        <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Anexar Arquivo (opcional)</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, JPG, PNG (máx. 10MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isConcluida && (
              <div className="flex justify-end mt-4">
                <Button onClick={enviarComplemento} disabled={enviandoComp || !compTxt.trim()} className="font-semibold" style={{ background: "#1351B4" }}>
                  {enviandoComp ? "Enviando..." : "Enviar Complemento"}
                </Button>
              </div>
            )}

            {isConcluida && (
              <div className="rounded-xl p-4 mt-4 flex gap-3" style={{ background: "#FFFBE6", border: "1px solid #F0D080" }}>
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#C2850C" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#7A5800" }}>Não ficou satisfeito com a resposta?</p>
                  <p className="text-xs mt-1 text-[#6B6B6B] leading-relaxed">
                    Você pode registrar uma nova manifestação tipo{" "}
                    <Link href="/nova-manifestacao" className="underline font-medium" style={{ color: "#1351B4" }}>Reclamação</Link>
                    {" "}caso sua demanda não tenha sido resolvida.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Avaliação */}
          {isConcluida && (
            <div className="bg-white rounded-2xl border border-[#E8EAF0] p-6 shadow-sm">
              <h2 className="text-base font-semibold text-[#1B1B1B] mb-1">Avalie o Atendimento</h2>
              <p className="text-sm text-muted-foreground mb-4">O que você achou do atendimento?</p>
              {jaAvaliou ? (
                <div className="text-center py-4">
                  <div className="flex justify-center gap-1 mb-2">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="w-6 h-6" fill={s <= m.avaliacao.nota ? "#FFCD07" : "none"} stroke={s <= m.avaliacao.nota ? "#FFCD07" : "#CCCCCC"} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Avaliação enviada. Obrigado!</p>
                </div>
              ) : (
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button" onClick={() => setNota(s)}>
                        <Star className="w-8 h-8 transition-all" fill={s <= nota ? "#FFCD07" : "none"} stroke={s <= nota ? "#FFCD07" : "#CCCCCC"} />
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-4">
                    <span>Ruim</span><span>Ótimo</span>
                  </div>
                  <div className="mb-4">
                    <Label className="text-sm font-medium">Como você avalia o atendimento recebido?</Label>
                    <Textarea placeholder="Como você avalia o atendimento recebido?" rows={4} className="mt-1 resize-none" value={avalTxt} onChange={(e) => setAvalTxt(e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1 text-right">Limite máximo de <strong>8000</strong> caracteres</p>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={enviarAvaliacao} disabled={enviandoAval || !nota} variant="outline" className="font-semibold border-[#1351B4] text-[#1351B4] hover:bg-[#EEF4FF]">
                      {enviandoAval ? "Enviando..." : "Avaliar"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
