import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "Introdução/Sobre o Design System",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const BemVindo: Story = {
  name: "Bem-vindo",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ fontFamily: "Raleway, sans-serif", background: "#f0f4ff", minHeight: "100vh", padding: "48px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, background: "#1351B4", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>OD</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "#1351B4", lineHeight: 1.1 }}>Design System</h1>
            <p style={{ margin: 0, fontSize: 14, color: "#6B6B6B", marginTop: 4 }}>Ouvidoria Digital — baseado no DSGOV v3 gov.br</p>
          </div>
        </div>

        {/* Banner info */}
        <div style={{ background: "#EEF4FF", border: "1px solid #C7D7F5", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#0c326f", lineHeight: 1.7 }}>
            Este Design System implementa os padrões oficiais do <strong>DSGOV — Design System do Governo Federal (v3)</strong>.
            Todos os tokens, componentes e estilos seguem as diretrizes do portal <strong>gov.br</strong> e estão
            sincronizados com o site em produção.
          </p>
        </div>

        {/* Tokens grid */}
        <div style={{ background: "white", borderRadius: 16, padding: 32, marginBottom: 24, border: "1px solid #E8EAF0" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 700, color: "#1B1B1B" }}>🎨 Tokens Principais</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Cor primária",      value: "#1351B4",  sub: "blue-warm-vivid-50",       dot: "#1351B4" },
              { label: "Cor de foco",       value: "#C2850C",  sub: "gold-vivid-40 — Ring",      dot: "#C2850C" },
              { label: "Sucesso",           value: "#168821",  sub: "green-cool-vivid-50",        dot: "#168821" },
              { label: "Erro",              value: "#E52207",  sub: "red-vivid-50",               dot: "#E52207" },
              { label: "Fonte",             value: "Raleway",  sub: "Rawline fallback DSGOV",    dot: "#6B6B6B" },
              { label: "Tamanho base",      value: "14px",     sub: "--font-size-base",           dot: "#6B6B6B" },
              { label: "Escala tipográfica",value: "1.2×",     sub: "Modular type scale",         dot: "#6B6B6B" },
              { label: "Botões pill",       value: "100px",    sub: "--surface-rounder-pill",     dot: "#6B6B6B" },
            ].map(({ label, value, sub, dot }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#F8F8F8", borderRadius: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "#6B6B6B" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1B1B1B" }}>{value}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9E9E9E", fontFamily: "monospace" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Como usar no Figma */}
        <div style={{ background: "white", borderRadius: 16, padding: 32, marginBottom: 24, border: "1px solid #E8EAF0" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#1B1B1B" }}>🔌 Como usar no Figma</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { step: "1", text: "Abra o Figma → Plugins → Procurar plugins" },
              { step: "2", text: 'Busque por "Storybook Connect" (plugin oficial da Chromatic)' },
              { step: "3", text: "Cole a URL: https://ouvidoria-storybook.vercel.app" },
              { step: "4", text: "Selecione um componente no Figma e vincule à story correspondente" },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1351B4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{step}</span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: "#1B1B1B", lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Estrutura */}
        <div style={{ background: "white", borderRadius: 16, padding: 32, marginBottom: 24, border: "1px solid #E8EAF0" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#1B1B1B" }}>📦 Estrutura do Design System</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "🎨", section: "Tokens de Cor",    desc: "Paleta completa DSGOV — azul, verde, vermelho, ouro, cinzas" },
              { icon: "🔤", section: "Tipografia",       desc: "Escala modular 1.2×, 17 variantes, cores e alinhamentos" },
              { icon: "🔘", section: "Botões",           desc: "12 variantes, 5 tamanhos, estados, ícones e largura total" },
            ].map(({ icon, section, desc }) => (
              <div key={section} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", background: "#F8F8F8", borderRadius: 10 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1351B4" }}>{section}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#6B6B6B" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 14, padding: "16px 24px" }}>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#276749" }}>🔗 Links úteis</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Portal DSGOV",        href: "https://www.gov.br/ds" },
              { label: "Site em produção",    href: "https://ouvidoria-digital.vercel.app" },
              { label: "Storybook",           href: "https://ouvidoria-storybook.vercel.app" },
              { label: "GitHub",              href: "https://github.com/girlaneslima-alt/ouvidoria-digital" },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                style={{ fontSize: 13, color: "#1351B4", textDecoration: "none", fontWeight: 600, borderBottom: "1px solid #1351B4", paddingBottom: 1 }}>
                {label} ↗
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  ),
};
