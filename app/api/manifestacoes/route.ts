import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { novaManifestacaoSchema } from "@/lib/validations";
import { gerarProtocolo, calcularPrazoLegal, TIPO_MANIFESTACAO_LABELS } from "@/lib/manifestacao";
import { enviarEmailProtocolo } from "@/lib/email";

// GET — lista manifestações do cidadão logado
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

// POST — nova manifestação
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = novaManifestacaoSchema.parse(body);

    const cidadao = await db.cidadao.findUnique({
      where: { userId: session.user.id },
      include: { user: true },
    });

    if (!cidadao) {
      return NextResponse.json({ error: "Complete seu perfil primeiro." }, { status: 400 });
    }

    const protocolo = gerarProtocolo();
    const prazoLegal = calcularPrazoLegal(new Date());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const manifestacao = await db.$transaction(async (tx: any) => {
      const m = await tx.manifestacao.create({
        data: {
          protocolo,
          tipo: data.tipo,
          assunto: data.assunto,
          descricao: data.descricao,
          sigiloso: data.sigiloso,
          cidadaoId: cidadao.id,
          unidadeOrigemId: data.unidadeOrigemId ?? null,
          prazoLegal,
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

    // Envia e-mail de confirmação
    if (cidadao.user.email) {
      await enviarEmailProtocolo({
        email: cidadao.user.email,
        nome: cidadao.nomeSocial ?? cidadao.nomeCompleto,
        protocolo,
        tipo: TIPO_MANIFESTACAO_LABELS[data.tipo],
      }).catch(console.error);
    }

    return NextResponse.json({ protocolo, id: manifestacao.id }, { status: 201 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    console.error("[MANIFESTACAO]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
