import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cadastroCidadaoSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = cadastroCidadaoSchema.parse(body);

    // Verifica se email já existe
    const existente = await db.user.findUnique({ where: { email: data.email } });
    if (existente) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    const senhaHash = await bcrypt.hash(data.senha, 12);

    const user = await db.$transaction(async (tx: any) => {
      // 1. Cria o usuário Auth.js
      const newUser = await tx.user.create({
        data: {
          name:          data.nomeSocial ?? data.nomeCompleto,
          email:         data.email,
          emailVerified: new Date(), // cadastro direto = verificado
        },
      });

      // 2. Cria o perfil do cidadão com todos os campos do formulário
      await tx.cidadao.create({
        data: {
          userId: newUser.id,

          // Tipo de demandante
          estrangeiro: data.estrangeiro,
          tipoPessoa:  data.tipoPessoa,

          // Pessoa Física
          nomeCompleto:   data.nomeCompleto,
          nomeSocial:     data.nomeSocial     ?? null,
          nomeMae:        data.nomeMae        ?? null,
          dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : null,
          cpf:            data.naoTemCpf ? null : (data.cpf ?? null),
          naoTemCpf:      data.naoTemCpf,

          // Estrangeiro
          nacionalidade: data.nacionalidade ?? null,
          paisOrigem:    data.paisOrigem    ?? null,
          cidadeOrigem:  data.cidadeOrigem  ?? null,

          // Pessoa Jurídica
          nomeEmpresa:        data.nomeEmpresa        ?? null,
          cnpj:               data.cnpj               ?? null,
          nomeRepresentante:  data.nomeRepresentante  ?? null,
          cpfRepresentante:   data.cpfRepresentante   ?? null,
          emailRepresentante: data.emailRepresentante ?? null,
          contratoEmpresa:    data.contratoEmpresa    ?? null,

          // Endereço
          cep:         data.cep         ?? null,
          logradouro:  data.logradouro  ?? null,
          numero:      data.numero      ?? null,
          complemento: data.complemento ?? null,
          bairro:      data.bairro      ?? null,
          cidade:      data.cidade      ?? null,
          estado:      data.estado      ?? null,
          endereco:    data.endereco    ?? null,
          municipio:   data.cidade      ?? data.municipio ?? null,
          uf:          data.estado      ?? data.uf        ?? null,

          // Contato
          telefone: data.telefone ?? null,
        },
      });

      // 3. Salva a senha via modelo Prisma (não mais raw SQL)
      await tx.senhaCidadao.create({
        data: {
          userId: newUser.id,
          senha:  senhaHash,
        },
      });

      return newUser;
    });

    return NextResponse.json({ ok: true, userId: user.id }, { status: 201 });

  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos.", issues: err.issues },
        { status: 400 }
      );
    }
    console.error("[CADASTRO ERROR]", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
