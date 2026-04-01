import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "Design System/Tokens de Cor",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

// ── Swatch ───────────────────────────────────────────────────────────────────
function Swatch({
  name, hex, token, textDark = false,
}: { name: string; hex: string; token: string; textDark?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          background: hex,
          borderRadius: 12,
          height: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "10px 12px",
          border: hex === "#ffffff" || hex === "#f8f8f8" ? "1px solid #e8eaf0" : "none",
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: textDark ? "#1b1b1b" : "white", opacity: 0.9 }}>{hex.toUpperCase()}</span>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1b1b1b" }}>{name}</p>
        <p style={{ margin: 0, fontSize: 11, color: "#6b6b6b", fontFamily: "monospace" }}>{token}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
        {title}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

export const PaletaCompleta: Story = {
  name: "Paleta completa",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ background: "white", borderRadius: 16, padding: 40, maxWidth: 900 }}>
      <h2 style={{ margin: "0 0 8px", color: "#1351b4", fontSize: 22, fontWeight: 700 }}>Tokens de Cor</h2>
      <p style={{ margin: "0 0 40px", color: "#6b6b6b", fontSize: 14 }}>
        Paleta oficial DSGOV v3 — gov.br
      </p>

      <Section title="Azul Primário — GOV.BR">
        <Swatch name="Primary Dark"    hex="#071d41" token="--color-primary-darker" />
        <Swatch name="Primary"         hex="#0c326f" token="--color-primary-dark" />
        <Swatch name="Primary Default" hex="#1351b4" token="--color-primary-default" />
        <Swatch name="Primary Light"   hex="#d4e0ee" token="--color-primary-light"   textDark />
        <Swatch name="Primary Lighter" hex="#dbe8fb" token="--color-primary-lighter" textDark />
      </Section>

      <Section title="Foco — Ouro GOV.BR">
        <Swatch name="Focus / Ring" hex="#c2850c" token="--color-focus / --ring" />
        <Swatch name="Warning Dark" hex="#d4a017" token="--color-warning-dark" />
        <Swatch name="Warning"      hex="#ffcd07" token="--color-warning-default" textDark />
        <Swatch name="Warning Light" hex="#fff5c2" token="--color-warning-light"  textDark />
      </Section>

      <Section title="Sucesso — Verde GOV.BR">
        <Swatch name="Success Dark"  hex="#0f6518" token="--color-success-dark" />
        <Swatch name="Success"       hex="#168821" token="--color-success-default" />
        <Swatch name="Success Light" hex="#e3f5e1" token="--color-success-light"   textDark />
      </Section>

      <Section title="Erro — Vermelho GOV.BR">
        <Swatch name="Danger Dark"  hex="#c01a05" token="--color-danger-dark" />
        <Swatch name="Danger"       hex="#e52207" token="--color-danger-default" />
        <Swatch name="Danger Light" hex="#fde0db" token="--color-danger-light"  textDark />
      </Section>

      <Section title="Neutros — Cinzas">
        <Swatch name="Gray 100" hex="#1b1b1b" token="--color-gray-100" />
        <Swatch name="Gray 90"  hex="#333333" token="--color-gray-90" />
        <Swatch name="Gray 80"  hex="#6b6b6b" token="--color-gray-80" />
        <Swatch name="Gray 60"  hex="#9e9e9e" token="--color-gray-60" textDark />
        <Swatch name="Gray 40"  hex="#cccccc" token="--color-gray-40" textDark />
        <Swatch name="Gray 20"  hex="#e0e0e0" token="--color-gray-20" textDark />
        <Swatch name="Gray 10"  hex="#f0f0f0" token="--color-gray-10" textDark />
        <Swatch name="Gray 5"   hex="#f8f8f8" token="--color-gray-5"  textDark />
      </Section>
    </div>
  ),
};

export const UsoCores: Story = {
  name: "Uso em contexto",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 700 }}>

      {/* Botões */}
      <div style={{ background: "white", borderRadius: 16, padding: 24 }}>
        <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Aplicação em botões
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Ação principal",     bg: "#1351b4", color: "white",   border: "none" },
            { label: "Ação secundária",    bg: "white",   color: "#1351b4", border: "2px solid #1351b4" },
            { label: "Confirmar",          bg: "#168821", color: "white",   border: "none" },
            { label: "Excluir",            bg: "#e52207", color: "white",   border: "none" },
            { label: "Atenção",            bg: "#ffcd07", color: "#1b1b1b", border: "none" },
          ].map((b) => (
            <div
              key={b.label}
              style={{
                background: b.bg, color: b.color, border: b.border,
                borderRadius: 100, padding: "8px 20px", fontSize: 13, fontWeight: 600,
              }}
            >
              {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* Status badges */}
      <div style={{ background: "white", borderRadius: 16, padding: 24 }}>
        <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Status de manifestação
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Registrada",          bg: "#dbe8fb", color: "#1351b4" },
            { label: "Em análise",          bg: "#fff5c2", color: "#8a6500" },
            { label: "Respondida",          bg: "#e3f5e1", color: "#0f6518" },
            { label: "Encerrada",           bg: "#f0f0f0", color: "#333333" },
            { label: "Cancelada",           bg: "#fde0db", color: "#c01a05" },
          ].map((s) => (
            <span
              key={s.label}
              style={{
                background: s.bg, color: s.color,
                borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 600,
              }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Focus ring */}
      <div style={{ background: "white", borderRadius: 16, padding: 24 }}>
        <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Foco de acessibilidade — ouro DSGOV
        </p>
        <div
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "#1351b4", color: "white", borderRadius: 100,
            padding: "10px 24px", fontSize: 14, fontWeight: 600,
            outline: "3px solid #c2850c", outlineOffset: 3,
          }}
        >
          Elemento com foco
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12, color: "#6b6b6b" }}>
          Ring: <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>#C2850C</code> — token{" "}
          <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>--color-focus</code>
        </p>
      </div>
    </div>
  ),
};
