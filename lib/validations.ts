import { z } from "zod";

// ─── Cadastro do Cidadão ──────────────────────────────────────────────────────

export const cadastroCidadaoSchema = z
  .object({
    estrangeiro: z.boolean().default(false),
    tipoPessoa: z.enum(["FISICA", "JURIDICA"]).default("FISICA"),
    cpf: z.string().optional(),
    naoTemCpf: z.boolean().default(false),
    nomeCompleto: z.string().min(3, "Nome completo é obrigatório"),
    nomeSocial: z.string().optional(),
    nomeMae: z.string().optional(),
    dataNascimento: z.string().optional(),
    telefone: z.string().optional(),
    cep: z.string().optional(),
    endereco: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().max(2).optional(),
    email: z.string().email("E-mail inválido"),
    confirmarEmail: z.string().email("E-mail inválido"),
    senha: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Pelo menos 1 letra maiúscula")
      .regex(/[!@#$%]/, "Pelo menos 1 caractere especial (! @ # $ %)"),
    confirmarSenha: z.string(),
    aceiteTermos: z.literal(true).refine((v) => v === true, {
      message: "Você deve aceitar os termos",
    }),
  })
  .refine((d) => d.email === d.confirmarEmail, {
    message: "Os e-mails não coincidem",
    path: ["confirmarEmail"],
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })
  .refine((d) => d.naoTemCpf || (d.cpf && d.cpf.length >= 11), {
    message: "CPF é obrigatório ou marque 'Não possuo'",
    path: ["cpf"],
  });

export type CadastroCidadaoInput = z.infer<typeof cadastroCidadaoSchema>;

// ─── Nova Manifestação ────────────────────────────────────────────────────────

export const novaManifestacaoSchema = z.object({
  tipo: z.enum([
    "DENUNCIA",
    "ELOGIO",
    "SOLICITACAO",
    "SUGESTAO",
    "SIMPLIFIQUE",
    "INFORMACAO",
    "RECLAMACAO",
  ]),
  assunto: z.string().min(5, "Assunto é obrigatório").max(200),
  descricao: z
    .string()
    .min(20, "Descreva com pelo menos 20 caracteres")
    .max(5000),
  sigiloso: z.boolean().default(false),
  unidadeOrigemId: z.string().optional(),
});

export type NovaManifestacaoInput = z.infer<typeof novaManifestacaoSchema>;

// ─── Consulta por Protocolo ───────────────────────────────────────────────────

export const consultaProtocoloSchema = z.object({
  protocolo: z
    .string()
    .min(14, "Protocolo inválido")
    .max(16, "Protocolo inválido"),
});

export type ConsultaProtocoloInput = z.infer<typeof consultaProtocoloSchema>;
