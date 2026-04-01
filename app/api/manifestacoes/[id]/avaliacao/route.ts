import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  nota:  z.number().int().min(1).max(5),
  texto: z.string().max(2000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const body = await req.json();
    const { nota, texto } = schema.parse(body);

    const manifestacao = await db.manifestacao.findUnique({
      where: { id },
      include: { cidadao: true, avaliacao: true },
    });

    if (!manifestacao) {
      return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
    }

    if (manifestacao.avaliacao) {
      return NextResponse.json({ error: "Já avaliada." }, { status: 409 });
    }

    if (manifestacao.cidadaoId && session?.user?.id) {
      if (manifestacao.cidadao?.userId !== session.user.id) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
    }

    const avaliacao = await db.avaliacao.create({
      data: {
        manifestacaoId: id,
        nota,
        texto: texto ?? null,
      },
    });

    return NextResponse.json(avaliacao, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    console.error("[AVALIACAO]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
