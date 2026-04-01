import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink, ChevronRight } from "lucide-react";
import { STATUS_LABELS, STATUS_COR } from "@/lib/manifestacao";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const cidadao = await db.cidadao.findUnique({
    where: { userId: session.user.id },
    include: {
      user: { select: { email: true } },
      manifestacoes: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { prazo: true },
      },
    },
  });

  const manifestacoes = cidadao?.manifestacoes ?? [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="flex justify-end mb-6">
            <Link href="/nova-manifestacao">
              <Button variant="outline" className="gap-2 font-semibold border-[#1351B4] text-[#1351B4] hover:bg-[#EEF4FF]">
                Nova manifestação
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Dados Pessoais */}
          <div className="bg-white rounded-2xl border border-[#E8EAF0] p-6 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 rounded-full bg-[#1351B4]" />
              <h2 className="text-base font-semibold text-[#1B1B1B]">Dados Pessoais</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div><p className="text-xs text-muted-foreground mb-0.5">Nome Completo</p><p className="text-sm font-medium">{cidadao?.nomeCompleto || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground mb-0.5">Nome Social</p><p className="text-sm font-medium">{cidadao?.nomeSocial || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground mb-0.5">CPF/CNPJ</p><p className="text-sm font-medium">{cidadao?.cpf ?? cidadao?.cnpj ?? "—"}</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Data de Nascimento</p>
                <p className="text-sm font-medium">
                  {cidadao?.dataNascimento ? format(new Date(cidadao.dataNascimento), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                </p>
              </div>
              <div><p className="text-xs text-muted-foreground mb-0.5">Nome da Mãe</p><p className="text-sm font-medium">{cidadao?.nomeMae || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground mb-0.5">Telefone</p><p className="text-sm font-medium">{cidadao?.telefone || "—"}</p></div>
            </div>
            <div><p className="text-xs text-muted-foreground mb-0.5">E-mail</p><p className="text-sm font-medium">{cidadao?.user?.email || "—"}</p></div>

            <div className="flex items-center gap-2 mt-6 mb-4">
              <div className="w-1 h-5 rounded-full bg-[#1351B4]" />
              <h2 className="text-base font-semibold text-[#1B1B1B]">Endereço</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div><p className="text-xs text-muted-foreground mb-0.5">Logradouro</p><p className="text-sm font-medium">{cidadao?.logradouro ?? cidadao?.endereco ?? "—"}</p></div>
              <div><p className="text-xs text-muted-foreground mb-0.5">Complemento</p><p className="text-sm font-medium">{cidadao?.complemento || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground mb-0.5">Número</p><p className="text-sm font-medium">{cidadao?.numero || "—"}</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><p className="text-xs text-muted-foreground mb-0.5">Bairro</p><p className="text-sm font-medium">{cidadao?.bairro || "—"}</p></div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Cidade/UF</p>
                <p className="text-sm font-medium">
                  {cidadao?.cidade && cidadao?.estado ? `${cidadao.cidade} / ${cidadao.estado}` : cidadao?.municipio ?? cidadao?.cidade ?? "—"}
                </p>
              </div>
              <div><p className="text-xs text-muted-foreground mb-0.5">CEP</p><p className="text-sm font-medium">{cidadao?.cep || "—"}</p></div>
            </div>

            <p className="text-xs text-muted-foreground mt-5">
              Mantenha seus dados atualizados para garantir o recebimento das comunicações oficiais da Ouvidoria.{" "}
              <Link href="/perfil" className="underline" style={{ color: "#1351B4" }}>Clique aqui para atualizar</Link>
            </p>
          </div>

          <div className="border-t border-[#E8EAF0] my-6" />

          <h2 className="text-base font-semibold text-[#1B1B1B] mb-4">Manifestações registradas</h2>

          <div className="bg-white rounded-2xl border border-[#E8EAF0] overflow-hidden shadow-sm">
            {manifestacoes.length === 0 ? (
              <div className="py-16 text-center px-4">
                <p className="text-muted-foreground text-sm mb-4">Você ainda não registrou nenhuma manifestação.</p>
                <Link href="/nova-manifestacao">
                  <Button style={{ background: "#1351B4" }} className="font-semibold">Registrar primeira manifestação</Button>
                </Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F0F4FA] border-b border-[#E8EAF0]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Protocolo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Assunto</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide hidden sm:table-cell">Data de Abertura</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide hidden md:table-cell">Prazo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Situação</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0]">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {manifestacoes.map((m: any) => (
                    <tr key={m.id} className="hover:bg-[#F8F8F8] transition-colors">
                      <td className="px-4 py-3.5">
                        <Link href={`/manifestacao/${m.id}`} className="font-mono text-xs font-semibold hover:underline" style={{ color: "#1351B4" }}>
                          {m.protocolo.slice(0, 8) + "/" + m.protocolo.slice(8, 10)}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <Link href={`/manifestacao/${m.id}`} className="text-sm text-[#1B1B1B] hover:underline line-clamp-1">{m.assunto}</Link>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#6B6B6B] hidden sm:table-cell">
                        {format(new Date(m.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#6B6B6B] hidden md:table-cell">
                        {m.prazo?.dataLimite ? format(new Date(m.prazo.dataLimite), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge className="text-xs font-semibold text-white whitespace-nowrap" style={{ background: (STATUS_COR as Record<string, string>)[m.status] ?? "#6B6B6B" }}>
                          {(STATUS_LABELS as Record<string, string>)[m.status]}
                        </Badge>
                      </td>
                      <td className="pr-3">
                        <Link href={`/manifestacao/${m.id}`}><ChevronRight className="w-4 h-4 text-muted-foreground" /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
