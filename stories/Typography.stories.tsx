import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Typography } from "@/components/ui/typography"

const meta: Meta<typeof Typography> = {
  title: "Design System/Typography",
  component: Typography,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "display","h1","h2","h3","h4","h5","h6",
        "body-lg","body","body-sm","body-xs",
        "lead","muted","label","caption","overline","code",
      ],
      description: "Escala tipografica",
    },
    color: {
      control: "select",
      options: ["default","primary","muted","success","warning","destructive","accent","white","inherit"],
      description: "Cor do texto",
    },
    align: {
      control: "select",
      options: ["left","center","right"],
      description: "Alinhamento",
    },
    truncate: { control: "boolean" },
    balance: { control: "boolean" },
    children: { control: "text" },
  },
  args: { children: "Texto de exemplo — Ouvidoria Digital", variant: "body" },
}

export default meta
type Story = StoryObj<typeof Typography>

export const Playground: Story = {
  name: "Playground",
  args: { children: "Texto de exemplo — ajuste as opcoes no painel" },
}

export const Scale: Story = {
  name: "Escala completa",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6 p-8 bg-white rounded-xl max-w-3xl">
      <div>
        <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-4">
          Display e Headings
        </p>
        <div className="flex flex-col gap-3">
          <Typography variant="display">Display — Hero title</Typography>
          <Typography variant="h1">H1 — Titulo principal</Typography>
          <Typography variant="h2">H2 — Subtitulo de secao</Typography>
          <Typography variant="h3">H3 — Titulo de card</Typography>
          <Typography variant="h4">H4 — Titulo de grupo</Typography>
          <Typography variant="h5">H5 — Label de secao</Typography>
          <Typography variant="h6">H6 — Micro titulo</Typography>
        </div>
      </div>
      <hr />
      <div>
        <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-4">
          Body
        </p>
        <div className="flex flex-col gap-3">
          <Typography variant="body-lg">
            Body LG — Texto grande para paragrafos de destaque e introducoes.
          </Typography>
          <Typography variant="body">
            Body — Texto padrao para conteudo principal. Tamanho ideal para leitura confortavel.
          </Typography>
          <Typography variant="body-sm">
            Body SM — Texto menor para informacoes secundarias e complementares.
          </Typography>
          <Typography variant="body-xs">
            Body XS — Texto minimo para metadados, timestamps e rodapes.
          </Typography>
        </div>
      </div>
      <hr />
      <div>
        <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-4">
          Estilos especiais
        </p>
        <div className="flex flex-col gap-3">
          <Typography variant="lead">
            Lead — Paragrafo introdutorio com destaque visual para paginas de conteudo.
          </Typography>
          <Typography variant="muted">
            Muted — Texto de suporte, notas e informacoes de menor importancia.
          </Typography>
          <Typography variant="label">Label — Rotulo de campo de formulario</Typography>
          <Typography variant="caption">Caption — Legenda de imagem ou informacao contextual</Typography>
          <Typography variant="overline">Overline — Categoria ou secao</Typography>
          <Typography variant="code">codigo.exemplo()</Typography>
        </div>
      </div>
    </div>
  ),
}

export const Colors: Story = {
  name: "Cores do sistema",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3 p-8 bg-white rounded-xl">
      <Typography variant="h4" color="default">Default — #1B1B1B</Typography>
      <Typography variant="h4" color="primary">Primary — #1351B4 (GOV.BR azul)</Typography>
      <Typography variant="h4" color="muted">Muted — #6B6B6B</Typography>
      <Typography variant="h4" color="success">Success — #168821 (GOV.BR verde)</Typography>
      <Typography variant="h4" color="warning">Warning — #E06200 (GOV.BR laranja)</Typography>
      <Typography variant="h4" color="destructive">Destructive — #E52207 (GOV.BR vermelho)</Typography>
      <div className="bg-[#1351B4] p-4 rounded-lg">
        <Typography variant="h4" color="white">White — para fundos escuros</Typography>
      </div>
    </div>
  ),
}

export const Headings: Story = {
  name: "Headings",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 p-8 bg-white rounded-xl max-w-2xl">
      <Typography variant="h1">Titulo H1 — Pagina principal</Typography>
      <Typography variant="h2">Titulo H2 — Secao da pagina</Typography>
      <Typography variant="h3">Titulo H3 — Subsecao ou card</Typography>
      <Typography variant="h4">Titulo H4 — Grupo de campos</Typography>
      <Typography variant="h5">Titulo H5 — Agrupamento menor</Typography>
      <Typography variant="h6">Titulo H6 — Micro-agrupamento</Typography>
    </div>
  ),
}

export const InContext: Story = {
  name: "Exemplo em contexto",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-8 bg-white rounded-xl max-w-2xl">
      <Typography variant="overline" color="primary" className="mb-2 block">
        Manifestacoes
      </Typography>
      <Typography variant="h2" className="mb-2">
        Acompanhe sua manifestacao
      </Typography>
      <Typography variant="lead" className="mb-6">
        Consulte o status da sua manifestacao informando o numero do protocolo
        gerado no momento do registro.
      </Typography>
      <div className="bg-[#F8F8F8] rounded-lg p-4 mb-4">
        <Typography variant="label" className="block mb-1">
          Numero do protocolo
        </Typography>
        <Typography variant="code" className="block">
          202503-00123456
        </Typography>
        <Typography variant="caption" className="block mt-1" color="muted">
          Prazo de resposta: 20 dias uteis
        </Typography>
      </div>
      <Typography variant="body" className="mb-2">
        Sua manifestacao foi registrada com sucesso e esta sendo analisada pela
        equipe responsavel.
      </Typography>
      <Typography variant="muted">
        Em caso de duvidas, entre em contato com a ouvidoria pelo canal de atendimento.
      </Typography>
    </div>
  ),
}

export const DisplayStory: Story = {
  name: "Display",
  args: { variant: "display", children: "Ouvidoria Digital" },
}

export const H1: Story = {
  name: "H1",
  args: { variant: "h1", children: "Titulo principal" },
}

export const H2: Story = {
  name: "H2",
  args: { variant: "h2", children: "Subtitulo de secao" },
}

export const BodyDefault: Story = {
  name: "Body",
  args: { variant: "body", children: "Texto de paragrafo padrao para conteudo principal." },
}

export const Lead: Story = {
  name: "Lead",
  args: { variant: "lead", children: "Paragrafo introdutorio com destaque visual." },
}

export const Muted: Story = {
  name: "Muted",
  args: { variant: "muted", children: "Texto de suporte e informacoes secundarias." },
}

export const Code: Story = {
  name: "Code",
  args: { variant: "code", children: "protocolo.verificar()" },
}

export const Overline: Story = {
  name: "Overline",
  args: { variant: "overline", children: "Categoria / Secao" },
}
