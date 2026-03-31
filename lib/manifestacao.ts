// Enums definidos localmente (espelho do schema Prisma)
type TipoManifestacao = "DENUNCIA" | "ELOGIO" | "SOLICITACAO" | "SUGESTAO" | "SIMPLIFIQUE" | "INFORMACAO" | "RECLAMACAO";
type StatusManifestacao = "REGISTRADA" | "EM_ANALISE" | "ENCAMINHADA" | "AGUARDANDO_RESPOSTA" | "RESPONDIDA" | "ENCERRADA" | "CANCELADA";

// Gera protocolo único: ANO + MÊS + 8 dígitos aleatórios
export function gerarProtocolo(): string {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = String(now.getMonth() + 1).padStart(2, "0");
  const aleatorio = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  return `${ano}${mes}${aleatorio}`;
}

// Calcula prazo legal (20 dias úteis a partir da data de registro)
export function calcularPrazoLegal(dataRegistro: Date): Date {
  const prazo = new Date(dataRegistro);
  prazo.setDate(prazo.getDate() + 20);
  return prazo;
}

export const TIPO_MANIFESTACAO_LABELS: Record<TipoManifestacao, string> = {
  DENUNCIA: "Denúncia",
  ELOGIO: "Elogio",
  SOLICITACAO: "Solicitação",
  SUGESTAO: "Sugestão",
  SIMPLIFIQUE: "Simplifique",
  INFORMACAO: "Informação",
  RECLAMACAO: "Reclamação",
};

export const TIPO_MANIFESTACAO_DESCRICAO: Record<TipoManifestacao, string> = {
  DENUNCIA: "Comunicar irregularidade na administração pública.",
  ELOGIO: "Registrar satisfação com o atendimento ou serviço.",
  SOLICITACAO: "Pedir a realização de um serviço público.",
  SUGESTAO: "Sugerir melhorias nos serviços e atendimentos.",
  SIMPLIFIQUE: "Solicitar a simplificação de serviços ou processos públicos.",
  INFORMACAO: "Solicitar informações ou esclarecimentos sobre ações, serviços, programas, benefícios.",
  RECLAMACAO: "Registrar insatisfação com serviço, programa ou atendimento público.",
};

export const TIPO_MANIFESTACAO_COR: Record<TipoManifestacao, string> = {
  DENUNCIA: "#E52207",
  ELOGIO: "#168821",
  SOLICITACAO: "#1351B4",
  SUGESTAO: "#9B59B6",
  SIMPLIFIQUE: "#17A2B8",
  INFORMACAO: "#E06200",
  RECLAMACAO: "#C0392B",
};

export const STATUS_LABELS: Record<StatusManifestacao, string> = {
  REGISTRADA: "Registrada",
  EM_ANALISE: "Em análise",
  ENCAMINHADA: "Encaminhada",
  AGUARDANDO_RESPOSTA: "Aguardando resposta",
  RESPONDIDA: "Respondida",
  ENCERRADA: "Encerrada",
  CANCELADA: "Cancelada",
};

export const STATUS_COR: Record<StatusManifestacao, string> = {
  REGISTRADA: "#6B6B6B",
  EM_ANALISE: "#E06200",
  ENCAMINHADA: "#1351B4",
  AGUARDANDO_RESPOSTA: "#9B59B6",
  RESPONDIDA: "#168821",
  ENCERRADA: "#1B1B1B",
  CANCELADA: "#E52207",
};
