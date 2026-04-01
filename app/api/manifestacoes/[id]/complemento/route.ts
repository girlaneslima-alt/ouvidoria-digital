import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  texto: z.string().min(10, "Mínimo 10 caracteres").max(8000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const body = await req.json();
    const { texto } = schema.parse(body);

    const manifestacao = await db.manifestacao.findUnique({
      where: { id },
      include: { cidadao: true },
    });

    if (!manifestacao) {
      return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
    }

    if (manifestacao.cidadaoId && session?.user?.id) {
      if (manifestacao.cidadao?.userId !== session.user.id) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
    }

    const complemento = await db.complemento.create({
      data: {
        manifestacaoId: id,
        texto,
      },
    });

    return NextResponse.json(complemento, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    console.error("[COMPLEMENTO]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
