import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ShuffleHero } from "@/components/ui/shuffle-hero";
import {
  AlertTriangle,
  ThumbsUp,
  FileText,
  Lightbulb,
  Layers,
  Info,
  ThumbsDown,
  Search,
  ArrowRight,
  UserCircle,
  ClipboardList,
  Hash,
  BellRing,
} from "lucide-react";

/* ── Tipos de manifestação ─────────────────────────────────────── */
const TIPOS = [
  {
    icon: AlertTriangle,
    label: "Denúncia",
    descricao: "Comunique irregularidades ou ilegalidades praticadas por agentes públicos.",
    tooltip: "Ex: servidor faltoso sem justificativa, desvio de verbas públicas, abuso de autoridade ou nepotismo.",
    cor: "#E52207",
    bg: "#FCDBD8",
    spotlightColor: "#E5220718",
  },
  {
    icon: ThumbsUp,
    label: "Elogio",
    descricao: "Registre sua satisfação com um atendimento ou serviço recebido.",
    tooltip: "Ex: atendente que resolveu seu problema com agilidade, serviço entregue antes do prazo.",
    cor: "#168821",
    bg: "#DAF0DD",
    spotlightColor: "#16882118",
  },
  {
    icon: FileText,
    label: "Solicitação",
    descricao: "Solicite a realização de um serviço público ao qual você tem direito.",
    tooltip: "Ex: reparo de calçamento, emissão de documento, instalação de sinalização de trânsito.",
    cor: "#1351B4",
    bg: "#D4E6FF",
    spotlightColor: "#1351B418",
  },
  {
    icon: Lightbulb,
    label: "Sugestão",
    descricao: "Proponha melhorias nos serviços, atendimentos e processos públicos.",
    tooltip: "Ex: ampliar horário de atendimento, criar canal digital para agendamentos, melhorar sinalização.",
    cor: "#9B59B6",
    bg: "#F3E8FF",
    spotlightColor: "#9B59B618",
  },
  {
    icon: Layers,
    label: "Simplifique",
    descricao: "Sugira a simplificação de exigências ou processos burocráticos.",
    tooltip: "Ex: reduzir documentos exigidos, eliminar etapas desnecessárias, digitalizar um processo presencial.",
    cor: "#17A2B8",
    bg: "#D4F4F9",
    spotlightColor: "#17A2B818",
  },
  {
    icon: Info,
    label: "Informação",
    descricao: "Solicite informações sobre programas, benefícios, serviços e ações.",
    tooltip: "Ex: como solicitar Bolsa Família, prazo de análise de processo, endereço de unidade de saúde.",
    cor: "#E06200",
    bg: "#FDE8D4",
    spotlightColor: "#E0620018",
  },
  {
    icon: ThumbsDown,
    label: "Reclamação",
    descricao: "Manifeste insatisfação com um serviço, programa ou atendimento público.",
    tooltip: "Ex: longa espera em fila, serviço não entregue no prazo, atendimento desrespeitoso.",
    cor: "#C0392B",
    bg: "#FCDBD8",
    spotlightColor: "#C0392B18",
  },
];

/* ── Passos de como funciona ───────────────────────────────────── */
const PASSOS = [
  {
    num: "01",
    icon: UserCircle,
    titulo: "Identifique‑se ou entre como anônimo",
    descricao:
      "Crie uma conta, acesse com e‑mail ou registre sua manifestação sem se identificar — você decide.",
  },
  {
    num: "02",
    icon: ClipboardList,
    titulo: "Escolha o tipo e descreva o fato",
    descricao:
      "Selecione denúncia, elogio, reclamação, sugestão e descreva com detalhes o que aconteceu.",
  },
  {
    num: "03",
    icon: Hash,
    titulo: "Receba o número de protocolo",
    descricao:
      "Ao enviar, você ganha um protocolo único para consultar e acompanhar sua manifestação a qualquer hora.",
  },
  {
    num: "04",
    icon: BellRing,
    titulo: "Acompanhe e receba a resposta",
    descricao:
      "A ouvidoria tem até 20 dias úteis para responder. Você é notificado a cada atualização do processo.",
  },
];

const TIPOS_ROW1 = TIPOS.slice(0, 4);
const TIPOS_ROW2 = TIPOS.slice(4);

/* ─── Componente de card com tooltip (CSS-only) ─────────────────── */
function TipoCard({ tipo }: { tipo: (typeof TIPOS)[number] }) {
  const Icon = tipo.icon;
  return (
    <Link href="/login" className="group h-full">
      <div className="relative h-full">
        {/* Tooltip */}
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-60
            pointer-events-none
            opacity-0 translate-y-1
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-200
          "
        >
          <div className="bg-[#1B1B1B] text-white text-xs rounded-xl px-3.5 py-2.5 leading-relaxed shadow-2xl">
            {tipo.tooltip}
            {/* seta */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#1B1B1B]" />
          </div>
        </div>

        {/* Card */}
        <SpotlightCard
          spotlightColor={tipo.spotlightColor}
          className="h-full rounded-2xl border border-[#E8EAF0] bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col"
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
            style={{ background: tipo.bg }}
          >
            <Icon className="w-7 h-7" style={{ color: tipo.cor }} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base text-[#1B1B1B] mb-2">{tipo.label}</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">{tipo.descricao}</p>
          </div>
          <div className="mt-5 flex items-center gap-1 text-sm font-semibold" style={{ color: tipo.cor }}>
            <span>Registrar</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </SpotlightCard>
      </div>
    </Link>
  );
}

/* ─── Página ─────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ── SEÇÃO 1: Hero ──────────────────────────────────────────── */}
      <ShuffleHero />

      {/* ── SEÇÃO 2: Como funciona ──────────────────────────────────── */}
      <section
        className="py-20 px-4"
        style={{ background: "linear-gradient(180deg, #EEF3FB 0%, #F8F9FC 100%)" }}
        id="como-funciona"
      >
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#1351B4] mb-3 opacity-80">
              Passo a passo
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1B1B1B] mb-4">
              Como funciona a{" "}
              <span style={{ color: "#1351B4" }}>ouvidoria digital</span>
            </h2>
            <p className="text-base text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">
              Um processo simples e transparente — do registro até a resposta oficial da instituição.
            </p>
          </div>

          {/* Steps grid com linha conectora */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">

            {/* Linha conectora — só desktop */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-[2rem] left-[12.5%] right-[12.5%] h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, #1351B440 20%, #1351B480 50%, #1351B440 80%, transparent 100%)",
              }}
            />

            {PASSOS.map((passo) => {
              const StepIcon = passo.icon;
              return (
                <div key={passo.num} className="relative flex flex-col items-center text-center">

                  {/* Círculo com ícone + badge numérico */}
                  <div className="relative mb-6 z-10">
                    {/* Anel externo */}
                    <div
                      className="absolute -inset-2 rounded-full border-2 border-[#1351B4]/20"
                      aria-hidden="true"
                    />
                    {/* Círculo principal */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #1351B4 0%, #0A3A8A 100%)",
                        boxShadow: "0 8px 24px #1351B430",
                      }}
                    >
                      <StepIcon className="w-7 h-7 text-white" />
                    </div>
                    {/* Badge com número */}
                    <span
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm z-20"
                      style={{ background: "#C2850C" }}
                    >
                      {passo.num}
                    </span>
                  </div>

                  {/* Texto */}
                  <h3 className="font-bold text-[15px] text-[#1B1B1B] mb-2 leading-snug">
                    {passo.titulo}
                  </h3>
                  <p className="text-sm text-[#5A5A5A] leading-relaxed max-w-[185px] mx-auto">
                    {passo.descricao}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA abaixo dos passos */}
          <div className="mt-14 text-center">
            <Link href="/nova-manifestacao">
              <Button size="lg" className="font-bold text-base px-8 shadow-md shadow-[#1351b4]/20">
                Começar agora
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: O que você quer fazer? ────────────────────────── */}
      <section
        className="py-20 px-4"
        style={{ background: "linear-gradient(180deg, #F8F9FC 0%, #FFFFFF 100%)" }}
        id="manifestacoes"
      >
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#1351B4] mb-3 opacity-80">
              Tipos de manifestação
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1B1B1B]">
              O que você quer{" "}
              <span style={{ color: "#1351B4" }}>fazer hoje?</span>
            </h2>
            <p className="text-base text-[#6B6B6B] max-w-xl mx-auto leading-relaxed">
              Escolha o canal que melhor descreve sua situação.
              Passe o mouse sobre cada card para ver exemplos práticos.
            </p>
          </div>

          {/* Row 1 — 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIPOS_ROW1.map((tipo) => (
              <TipoCard key={tipo.label} tipo={tipo} />
            ))}
          </div>

          {/* Row 2 — 3 cards centralizados */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5 lg:w-[calc(75%-0.375rem)] lg:mx-auto">
            {TIPOS_ROW2.map((tipo) => (
              <TipoCard key={tipo.label} tipo={tipo} />
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-14 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link href="/login" className="flex-1">
              <Button size="lg" fullWidth className="font-bold text-base shadow-md shadow-[#1351b4]/20">
                Fazer uma manifestação
              </Button>
            </Link>
            <Link href="/consultar-protocolo" className="flex-1">
              <Button size="lg" variant="outline" fullWidth className="font-semibold text-base">
                <Search className="w-5 h-5" />
                Consultar protocolo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 4: Consultar protocolo ───────────────────────────── */}
      <section className="py-16 px-4" style={{ background: "#F8F8F8" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#1351B4" }}>
            Acompanhar manifestação
          </h2>
          <p className="text-[#6B6B6B] mb-6">
            Já registrou uma demanda na ouvidoria? Insira o número do protocolo para acompanhar o andamento.
          </p>
          <Link href="/consultar-protocolo">
            <Button size="lg" className="font-semibold px-8" variant="accent">
              <Search className="w-4 h-4" />
              Consultar Protocolo
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
