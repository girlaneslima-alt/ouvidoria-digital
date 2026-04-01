import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manifestacao = await db.manifestacao.findUnique({
      where: { id: params.id },
      include: {
        cidadao: { include: { user: { select: { email: true } } } },
        respostas: {
          where: { visivelCidadao: true },
          orderBy: { createdAt: "asc" },
        },
        complementos: { orderBy: { createdAt: "asc" } },
        prazo: true,
        avaliacao: true,
      },
    });

    if (!manifestacao) {
      return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
    }

    if (manifestacao.cidadaoId) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
      if (manifestacao.cidadao?.userId !== session.user.id) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
    }

    return NextResponse.json(manifestacao);
  } catch (err) {
    console.error("[MANIFESTACAO GET]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
