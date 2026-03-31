// Design System Tokens — Ouvidoria Digital
// Single Source of Truth para todas as cores e estilos do projeto
// Baseado no padrão GOV.BR

export const tokens = {
  colors: {
    // Cores primárias GOV.BR
    primary: "#1351B4",
    primaryForeground: "#FFFFFF",
    primaryHover: "#0D3F8F",
    primaryLight: "#D4E6FF",

    // Fundo
    background: "#F8F8F8",
    foreground: "#1B1B1B",

    // Acento (amarelo GOV.BR)
    accent: "#FFCD07",
    accentForeground: "#1B1B1B",

    // Verde (sucesso / confirmado)
    success: "#168821",
    successForeground: "#FFFFFF",
    successLight: "#DAF0DD",

    // Vermelho (erro / alerta)
    destructive: "#E52207",
    destructiveForeground: "#FFFFFF",
    destructiveLight: "#FCDBD8",

    // Laranja (atenção)
    warning: "#E06200",
    warningForeground: "#FFFFFF",
    warningLight: "#FDE8D4",

    // Neutros
    card: "#FFFFFF",
    cardForeground: "#1B1B1B",
    muted: "#F0F0F0",
    mutedForeground: "#6B6B6B",
    border: "#CCCCCC",
    input: "#FFFFFF",
    ring: "#1351B4",

    // Sidebar
    sidebarBackground: "#071D41",
    sidebarForeground: "#FFFFFF",
    sidebarAccent: "#1351B4",
    sidebarBorder: "#0D3F8F",
  },

  // Tipos de manifestação e suas cores
  manifestacao: {
    denuncia: "#E52207",
    elogio: "#168821",
    solicitacao: "#1351B4",
    sugestao: "#9B59B6",
    simplifique: "#17A2B8",
    informacao: "#E06200",
    reclamacao: "#C0392B",
  },

  // Status de manifestação
  status: {
    registrada: "#6B6B6B",
    em_analise: "#E06200",
    encaminhada: "#1351B4",
    aguardando_resposta: "#9B59B6",
    respondida: "#168821",
    encerrada: "#1B1B1B",
    cancelada: "#E52207",
  },

  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSizeSm: "0.875rem",
    fontSizeBase: "1rem",
    fontSizeLg: "1.125rem",
    fontSizeXl: "1.25rem",
    fontSize2xl: "1.5rem",
    fontSize3xl: "1.875rem",
    fontSize4xl: "2.25rem",
  },
} as const;

export type DesignTokens = typeof tokens;
export default tokens;
