import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const protocolo = req.nextUrl.searchParams.get("numero");

  if (!protocolo || protocolo.length < 14) {
    return NextResponse.json({ error: "Protocolo inválido" }, { status: 400 });
  }

  const manifestacao = await db.manifestacao.findUnique({
    where: { protocolo: protocolo.trim().toUpperCase() },
    include: {
      prazo: true,
      respostas: {
        where: { visivelCidadao: true },
        orderBy: { createdAt: "desc" },
      },
      encaminhamentos: {
        include: { unidadeDestino: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!manifestacao) {
    return NextResponse.json({ error: "Protocolo não encontrado" }, { status: 404 });
  }

  // Não expõe dados sigilosos ou pessoais do cidadão
  return NextResponse.json({
    protocolo: manifestacao.protocolo,
    tipo: manifestacao.tipo,
    assunto: manifestacao.assunto,
    status: manifestacao.status,
    prazoLegal: manifestacao.prazoLegal,
    dataResposta: manifestacao.dataResposta,
    canalEntrada: manifestacao.canalEntrada,
    encaminhadoPara: manifestacao.encaminhamentos[0]?.unidadeDestino?.nome ?? null,
    respostas: manifestacao.respostas.map((r: { conteudo: string; tipo: string; createdAt: Date }) => ({
      conteudo: r.conteudo,
      tipo: r.tipo,
      data: r.createdAt,
    })),
    createdAt: manifestacao.createdAt,
    updatedAt: manifestacao.updatedAt,
  });
}
