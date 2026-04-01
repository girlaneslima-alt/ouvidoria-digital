import { z } from "zod";

export const cadastroCidadaoSchema = z
  .object({
    estrangeiro: z.boolean().default(false),
    tipoPessoa: z.enum(["FISICA", "JURIDICA"]).default("FISICA"),

    nomeCompleto: z.string().min(3, "Nome completo é obrigatório"),
    nomeSocial:   z.string().optional(),
    nomeMae:      z.string().optional(),
    dataNascimento: z.string().optional(),
    cpf:          z.string().optional(),
    naoTemCpf:    z.boolean().default(false),

    nacionalidade: z.string().optional(),
    paisOrigem:    z.string().optional(),
    cidadeOrigem:  z.string().optional(),

    nomeRepresentante:   z.string().optional(),
    cpfRepresentante:    z.string().optional(),
    emailRepresentante:  z.string().optional(),
    nomeEmpresa:         z.string().optional(),
    cnpj:                z.string().optional(),
    contratoEmpresa:     z.string().optional(),

    cep:          z.string().optional(),
    estado:       z.string().optional(),
    bairro:       z.string().optional(),
    cidade:       z.string().optional(),
    logradouro:   z.string().optional(),
    numero:       z.string().optional(),
    complemento:  z.string().optional(),
    endereco:     z.string().optional(),
    municipio:    z.string().optional(),
    uf:           z.string().max(2).optional(),

    telefone: z.string().optional(),
    email:    z.string().email("E-mail inválido"),
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
  .refine(
    (d) => {
      if (!d.estrangeiro && d.tipoPessoa === "FISICA") {
        return d.naoTemCpf || (!!d.cpf && d.cpf.replace(/\D/g, "").length === 11);
      }
      return true;
    },
    { message: "CPF é obrigatório ou marque 'Não possuo'", path: ["cpf"] }
  )
  .refine(
    (d) => {
      if (!d.estrangeiro && d.tipoPessoa === "JURIDICA") {
        return !!d.nomeEmpresa && d.nomeEmpresa.length >= 2;
      }
      return true;
    },
    { message: "Nome da empresa é obrigatório", path: ["nomeEmpresa"] }
  )
  .refine(
    (d) => {
      if (!d.estrangeiro && d.tipoPessoa === "JURIDICA") {
        return !!d.cnpj && d.cnpj.replace(/\D/g, "").length === 14;
      }
      return true;
    },
    { message: "CNPJ inválido", path: ["cnpj"] }
  );

export type CadastroCidadaoInput = z.infer<typeof cadastroCidadaoSchema>;

const envolvidoSchema = z.object({
  nome:   z.string().min(1),
  cpf:    z.string().optional(),
  esfera: z.string().optional(),
  orgao:  z.string().optional(),
});

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
  assunto:  z.string().min(5, "Assunto é obrigatório").max(200),
  descricao: z.string().min(20, "Descreva com pelo menos 20 caracteres").max(8000),
  sigiloso:  z.boolean().default(false),
  unidadeOrigemId: z.string().optional(),

  referidoNome:     z.string().optional(),
  referidoCpf:      z.string().optional(),
  referidoDataNasc: z.string().optional(),

  localFato:      z.string().optional(),
  localEsfera:    z.string().optional(),
  localOrgao:     z.string().optional(),
  localMunicipio: z.string().optional(),
  localEstado:    z.string().optional(),

  ouvidoriaEsfera: z.string().optional(),
  colaboradorOrgao: z.boolean().default(false),

  envolvidos: z.array(envolvidoSchema).default([]),
});

export type NovaManifestacaoInput = z.infer<typeof novaManifestacaoSchema>;

export const consultaProtocoloSchema = z.object({
  protocolo: z
    .string()
    .min(14, "Protocolo inválido")
    .max(16, "Protocolo inválido"),
});

export type ConsultaProtocoloInput = z.infer<typeof consultaProtocoloSchema>;
