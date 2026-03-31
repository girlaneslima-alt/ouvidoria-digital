"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { TIPO_MANIFESTACAO_LABELS, STATUS_LABELS, STATUS_COR } from "@/lib/manifestacao";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function ConsultarProtocoloContent() {
  const searchParams = useSearchParams();
  const [protocolo, setProtocolo] = useState(searchParams.get("protocolo") ?? "");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState("");

  async function consultar(e: React.FormEvent) {
    e.preventDefault();
    if (!protocolo.trim()) return;
    setLoading(true);
    setErro("");
    setResultado(null);
    try {
      const res = await fetch(`/api/protocolo?numero=${encodeURIComponent(protocolo.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Protocolo não encontrado");
      setResultado(data);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1351B4" }}>
            Acompanhar manifestação
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Já registrou uma demanda na ouvidoria? Insira o número de protocolo para acompanhar o andamento.
          </p>

          {/* Formulário de busca */}
          <form onSubmit={consultar} className="flex gap-2 mb-8">
            <Input
              placeholder="Ex: 202603XXXXXXXX"
              value={protocolo}
              onChange={(e) => setProtocolo(e.target.value.toUpperCase())}
              className="flex-1 font-mono"
              maxLength={16}
            />
            <Button
              type="submit"
              disabled={loading}
              style={{ background: "#FFCD07", color: "#1B1B1B" }}
              className="font-semibold px-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Consultar Protocolo
                </>
              )}
            </Button>
          </form>

          {/* Erro */}
          {erro && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{erro}</p>
            </div>
          )}

          {/* Resultado */}
          {resultado && (
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Número de protocolo</p>
                    <CardTitle
                      className="text-2xl font-bold tracking-widest mt-1"
                      style={{ color: "#1351B4" }}
                    >
                      {resultado.protocolo}
                    </CardTitle>
                  </div>
                  <Badge
                    className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{ background: STATUS_COR[resultado.status as keyof typeof STATUS_COR] ?? "#6B6B6B" }}
                  >
                    {STATUS_LABELS[resultado.status as keyof typeof STATUS_LABELS] ?? resultado.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="font-medium mt-0.5">
                      {TIPO_MANIFESTACAO_LABELS[resultado.tipo as keyof typeof TIPO_MANIFESTACAO_LABELS] ?? resultado.tipo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Registrada em</p>
                    <p className="font-medium mt-0.5">
                      {format(new Date(resultado.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Assunto</p>
                    <p className="font-medium mt-0.5">{resultado.assunto}</p>
                  </div>
                  {resultado.prazoLegal && (
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Prazo para resposta
                      </p>
                      <p className="font-medium mt-0.5">
                        {format(new Date(resultado.prazoLegal), "dd/MM/yyyy")}
                      </p>
                    </div>
                  )}
                  {resultado.encaminhadoPara && (
                    <div>
                      <p className="text-xs text-muted-foreground">Encaminhada para</p>
                      <p className="font-medium mt-0.5">{resultado.encaminhadoPara}</p>
                    </div>
                  )}
                </div>

                {/* Respostas */}
                {resultado.respostas?.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" style={{ color: "#168821" }} />
                      Resposta da ouvidoria
                    </h3>
                    {resultado.respostas.map((r: any, i: number) => (
                      <div
                        key={i}
                        className="bg-muted rounded-lg p-4 text-sm leading-relaxed"
                      >
                        <p>{r.conteudo}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(r.data), "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ConsultarProtocoloPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Carregando...</p></div>}>
      <ConsultarProtocoloContent />
    </Suspense>
  );
}
