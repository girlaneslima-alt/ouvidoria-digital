import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { novaManifestacaoSchema } from "@/lib/validations";
import { gerarProtocolo, calcularPrazoLegal, TIPO_MANIFESTACAO_LABELS } from "@/lib/manifestacao";
import { enviarEmailProtocolo } from "@/lib/email";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const cidadao = await db.cidadao.findUnique({
    where: { userId: session.user.id },
    include: {
      manifestacoes: {
        orderBy: { createdAt: "desc" },
        include: { prazo: true },
      },
    },
  });

  if (!cidadao) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
  }

  return NextResponse.json(cidadao.manifestacoes);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = novaManifestacaoSchema.parse(body);

    const session = await auth();
    const protocolo = gerarProtocolo();
    const prazoLegal = calcularPrazoLegal(new Date());

    let cidadaoId: string | null = null;
    let cidadaoEmail: string | null = null;
    let cidadaoNome: string | null = null;

    if (session?.user?.id) {
      const cidadao = await db.cidadao.findUnique({
        where: { userId: session.user.id },
        include: { user: true },
      });
      if (cidadao) {
        cidadaoId = cidadao.id;
        cidadaoEmail = cidadao.user.email;
        cidadaoNome = cidadao.nomeSocial ?? cidadao.nomeCompleto;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const manifestacao = await db.$transaction(async (tx: any) => {
      const m = await tx.manifestacao.create({
        data: {
          protocolo,
          tipo:            data.tipo,
          assunto:         data.assunto,
          descricao:       data.descricao,
          sigiloso:        data.sigiloso,
          cidadaoId:       cidadaoId ?? null,
          unidadeOrigemId: data.unidadeOrigemId ?? null,
          prazoLegal,
          referidoNome:     data.referidoNome     ?? null,
          referidoCpf:      data.referidoCpf      ?? null,
          referidoDataNasc: data.referidoDataNasc ?? null,
          localFato:        data.localFato        ?? null,
          localEsfera:      data.localEsfera      ?? null,
          localOrgao:       data.localOrgao       ?? null,
          localMunicipio:   data.localMunicipio   ?? null,
          localEstado:      data.localEstado      ?? null,
          ouvidoriaEsfera:  data.ouvidoriaEsfera  ?? null,
          colaboradorOrgao: data.colaboradorOrgao ?? false,
          envolvidos:       data.envolvidos.length > 0 ? data.envolvidos : null,
        },
      });

      await tx.prazo.create({
        data: {
          manifestacaoId: m.id,
          dataLimite: prazoLegal,
        },
      });

      return m;
    });

    if (cidadaoEmail) {
      await enviarEmailProtocolo({
        email:    cidadaoEmail,
        nome:     cidadaoNome ?? "Cidadão",
        protocolo,
        tipo:     TIPO_MANIFESTACAO_LABELS[data.tipo],
      }).catch(console.error);
    }

    return NextResponse.json({ protocolo, id: manifestacao.id }, { status: 201 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos.", issues: err.issues }, { status: 400 });
    }
    console.error("[MANIFESTACAO]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
