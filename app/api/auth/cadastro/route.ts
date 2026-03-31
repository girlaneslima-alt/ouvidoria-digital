import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cadastroCidadaoSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = cadastroCidadaoSchema.parse(body);

    // Verifica se email já existe
    const existente = await db.user.findUnique({
      where: { email: data.email },
    });
    if (existente) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(data.senha, 12);

    // Cria usuário + cidadão em transação
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await db.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          name: data.nomeSocial ?? data.nomeCompleto,
          email: data.email,
          emailVerified: new Date(), // cadastro direto = verificado
        },
      });

      await tx.cidadao.create({
        data: {
          userId: newUser.id,
          estrangeiro: data.estrangeiro,
          tipoPessoa: data.tipoPessoa,
          cpf: data.naoTemCpf ? null : data.cpf ?? null,
          naoTemCpf: data.naoTemCpf,
          nomeCompleto: data.nomeCompleto,
          nomeSocial: data.nomeSocial ?? null,
          nomeMae: data.nomeMae ?? null,
          dataNascimento: data.dataNascimento
            ? new Date(data.dataNascimento)
            : null,
          telefone: data.telefone ?? null,
          cep: data.cep ?? null,
          endereco: data.endereco ?? null,
          municipio: data.municipio ?? null,
          uf: data.uf ?? null,
        },
      });

      // Salva senha em tabela auxiliar (fora do padrão Auth.js)
      await tx.$executeRaw`
        INSERT INTO "SenhaCidadao" ("id", "userId", "senha", "createdAt")
        VALUES (gen_random_uuid()::text, ${newUser.id}, ${senhaHash}, NOW())
      `;

      return newUser;
    });

    return NextResponse.json({ ok: true, userId: user.id }, { status: 201 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos.", issues: err.issues }, { status: 400 });
    }
    console.error("[CADASTRO]", err);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
