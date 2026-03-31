import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, FileText, Clock, CheckCircle } from "lucide-react";
import {
  TIPO_MANIFESTACAO_LABELS,
  STATUS_LABELS,
  STATUS_COR,
  TIPO_MANIFESTACAO_COR,
} from "@/lib/manifestacao";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const cidadao = await db.cidadao.findUnique({
    where: { userId: session.user.id },
    include: {
      manifestacoes: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { prazo: true },
      },
    },
  });

  const nome = cidadao?.nomeSocial ?? cidadao?.nomeCompleto ?? session.user.name ?? "Cidadão";
  const manifestacoes = cidadao?.manifestacoes ?? [];

  const stats = {
    total: manifestacoes.length,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emAndamento: manifestacoes.filter((m: any) =>
      ["REGISTRADA", "EM_ANALISE", "ENCAMINHADA", "AGUARDANDO_RESPOSTA"].includes(m.status)
    ).length,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    respondidas: manifestacoes.filter((m: any) => m.status === "RESPONDIDA").length,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Boas-vindas */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#1351B4" }}>
                Olá, {nome.split(" ")[0]}!
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Acompanhe suas manifestações registradas na Ouvidoria Digital.
              </p>
            </div>
            <Link href="/nova-manifestacao">
              <Button style={{ background: "#1351B4" }} className="gap-2 font-semibold">
                <Plus className="w-4 h-4" />
                Nova Manifestação
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total", valor: stats.total, icon: FileText, cor: "#1351B4" },
              { label: "Em andamento", valor: stats.emAndamento, icon: Clock, cor: "#E06200" },
              { label: "Respondidas", valor: stats.respondidas, icon: CheckCircle, cor: "#168821" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="border border-border">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: `${stat.cor}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: stat.cor }} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold" style={{ color: stat.cor }}>
                          {stat.valor}
                        </p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Lista de manifestações */}
          <Card className="border border-border">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Minhas manifestações</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {manifestacoes.length === 0 ? (
                <div className="py-16 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground text-sm">
                    Você ainda não registrou nenhuma manifestação.
                  </p>
                  <Link href="/nova-manifestacao">
                    <Button
                      className="mt-4 font-semibold"
                      style={{ background: "#1351B4" }}
                    >
                      Registrar primeira manifestação
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {manifestacoes.map((m: any) => (
                    <div key={m.id} className="py-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                            style={{
                              background: (TIPO_MANIFESTACAO_COR as Record<string, string>)[m.tipo] ?? "#6B6B6B",
                            }}
                          >
                            {(TIPO_MANIFESTACAO_LABELS as Record<string, string>)[m.tipo]}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate">{m.assunto}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Protocolo:{" "}
                          <span className="font-mono font-medium">{m.protocolo}</span>{" "}
                          · {format(new Date(m.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge
                          className="text-xs text-white font-semibold"
                          style={{
                            background: (STATUS_COR as Record<string, string>)[m.status] ?? "#6B6B6B",
                          }}
                        >
                          {(STATUS_LABELS as Record<string, string>)[m.status]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
