"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle, ThumbsUp, FileText, Lightbulb,
  Layers, Info, ThumbsDown, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { novaManifestacaoSchema, type NovaManifestacaoInput } from "@/lib/validations";
import {
  TIPO_MANIFESTACAO_LABELS,
  TIPO_MANIFESTACAO_DESCRICAO,
  TIPO_MANIFESTACAO_COR,
} from "@/lib/manifestacao";

const TIPOS = [
  { key: "DENUNCIA", icon: AlertTriangle },
  { key: "ELOGIO", icon: ThumbsUp },
  { key: "SOLICITACAO", icon: FileText },
  { key: "SUGESTAO", icon: Lightbulb },
  { key: "SIMPLIFIQUE", icon: Layers },
  { key: "INFORMACAO", icon: Info },
  { key: "RECLAMACAO", icon: ThumbsDown },
] as const;

export default function NovaManifestacaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [protocolo, setProtocolo] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<NovaManifestacaoInput>({
    resolver: zodResolver(novaManifestacaoSchema) as any,
    defaultValues: { sigiloso: false },
  });

  const sigiloso = watch("sigiloso");

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

  if (protocolo) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="max-w-md text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "#DAF0DD" }}
            >
              <CheckCircle2 className="w-9 h-9" style={{ color: "#168821" }} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "#1351B4" }}>
              Manifestação registrada!
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Sua manifestação foi registrada com sucesso. Guarde o protocolo abaixo para acompanhar o andamento.
            </p>
            <div className="bg-white border border-border rounded-xl p-6 mb-6">
              <p className="text-xs text-muted-foreground mb-1">Número de protocolo</p>
              <p
                className="text-3xl font-bold tracking-widest"
                style={{ color: "#1351B4" }}
              >
                {protocolo}
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Um e-mail de confirmação foi enviado para você.
                <br />
                Prazo de resposta: até <strong>20 dias úteis</strong>.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Ver minhas manifestações
              </Button>
              <Button
                style={{ background: "#1351B4" }}
                onClick={() => {
                  setProtocolo("");
                  setTipoSelecionado("");
                }}
              >
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1351B4" }}>
            Nova Manifestação
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Selecione o tipo de manifestação e preencha as informações abaixo.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Seleção de tipo */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">O que você quer fazer?</CardTitle>
                {errors.tipo && (
                  <p className="text-xs text-destructive">{errors.tipo.message}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TIPOS.map(({ key, icon: Icon }) => {
                    const selecionado = tipoSelecionado === key;
                    const cor = TIPO_MANIFESTACAO_COR[key as keyof typeof TIPO_MANIFESTACAO_COR];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => selecionarTipo(key)}
                        className="rounded-xl border-2 p-4 text-left transition-all"
                        style={{
                          borderColor: selecionado ? cor : "#CCCCCC",
                          background: selecionado ? `${cor}12` : "white",
                        }}
                      >
                        <Icon className="w-6 h-6 mb-2" style={{ color: cor }} />
                        <p className="text-sm font-semibold">
                          {TIPO_MANIFESTACAO_LABELS[key as keyof typeof TIPO_MANIFESTACAO_LABELS]}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-tight">
                          {TIPO_MANIFESTACAO_DESCRICAO[key as keyof typeof TIPO_MANIFESTACAO_DESCRICAO]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Detalhes */}
            {tipoSelecionado && (
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Detalhes da manifestação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="assunto">Assunto *</Label>
                    <Input
                      id="assunto"
                      placeholder="Descreva o assunto em poucas palavras"
                      {...register("assunto")}
                      className={errors.assunto ? "border-destructive" : ""}
                    />
                    {errors.assunto && (
                      <p className="text-xs text-destructive">{errors.assunto.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva sua manifestação com detalhes suficientes para que a ouvidoria possa analisá-la..."
                      rows={6}
                      {...register("descricao")}
                      className={errors.descricao ? "border-destructive" : ""}
                    />
                    {errors.descricao && (
                      <p className="text-xs text-destructive">{errors.descricao.message}</p>
                    )}
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={sigiloso}
                      onCheckedChange={(v) => setValue("sigiloso", !!v)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium">Manifestação sigilosa</p>
                      <p className="text-xs text-muted-foreground">
                        Seus dados pessoais não serão compartilhados com o órgão responsável.
                      </p>
                    </div>
                  </label>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 font-semibold"
                style={{ background: "#1351B4" }}
                disabled={loading || !tipoSelecionado}
              >
                {loading ? "Registrando..." : "Registrar Manifestação"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
