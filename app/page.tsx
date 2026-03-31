import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { HeroGovBR } from "@/components/ui/hero-govbr";
import {
  AlertTriangle,
  ThumbsUp,
  FileText,
  Lightbulb,
  Layers,
  Info,
  ThumbsDown,
  Search,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  Plus,
} from "lucide-react";

const TIPOS = [
  {
    icon: AlertTriangle,
    label: "Denúncia",
    descricao: "Comunique irregularidades ou ilegalidades praticadas por agentes públicos.",
    cor: "#E52207",
    bg: "#FCDBD8",
    spotlightColor: "#E5220718",
  },
  {
    icon: ThumbsUp,
    label: "Elogio",
    descricao: "Registre sua satisfação com um atendimento ou serviço recebido.",
    cor: "#168821",
    bg: "#DAF0DD",
    spotlightColor: "#16882118",
  },
  {
    icon: FileText,
    label: "Solicitação",
    descricao: "Solicite a realização de um serviço público ao qual você tem direito.",
    cor: "#1351B4",
    bg: "#D4E6FF",
    spotlightColor: "#1351B418",
  },
  {
    icon: Lightbulb,
    label: "Sugestão",
    descricao: "Proponha melhorias nos serviços, atendimentos e processos públicos.",
    cor: "#9B59B6",
    bg: "#F3E8FF",
    spotlightColor: "#9B59B618",
  },
  {
    icon: Layers,
    label: "Simplifique",
    descricao: "Sugira a simplificação de exigências ou processos burocráticos.",
    cor: "#17A2B8",
    bg: "#D4F4F9",
    spotlightColor: "#17A2B818",
  },
  {
    icon: Info,
    label: "Informação",
    descricao: "Solicite informações sobre programas, benefícios, serviços e ações.",
    cor: "#E06200",
    bg: "#FDE8D4",
    spotlightColor: "#E0620018",
  },
  {
    icon: ThumbsDown,
    label: "Reclamação",
    descricao: "Manifeste insatisfação com um serviço, programa ou atendimento público.",
    cor: "#C0392B",
    bg: "#FCDBD8",
    spotlightColor: "#C0392B18",
  },
];

const PASSOS = [
  {
    num: "01",
    titulo: "Cadastre-se ou entre",
    descricao: "Crie sua conta gratuitamente ou acesse com o GOV.BR.",
  },
  {
    num: "02",
    titulo: "Escolha o tipo de manifestação",
    descricao: "Denúncia, elogio, reclamação, sugestão e outros.",
  },
  {
    num: "03",
    titulo: "Receba seu protocolo",
    descricao: "Um número único para acompanhar sua manifestação.",
  },
  {
    num: "04",
    titulo: "Acompanhe e receba resposta",
    descricao: "Prazo de até 20 dias úteis para resposta da ouvidoria.",
  },
];

const TIPOS_ROW1 = TIPOS.slice(0, 4);
const TIPOS_ROW2 = TIPOS.slice(4);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f8]">
      <Navbar />

      {/* ── SEÇÃO 1: Hero ─────────────────────────────────────────────────
          Sem botões CTA — foco na mensagem e na foto do cidadão.
          Hierarquia: Badge → H1 → Subtítulo → Trust indicators
      ────────────────────────────────────────────────────────────────── */}
      <HeroGovBR />

      {/* ── SEÇÃO 2: Tipos de Manifestação ────────────────────────────────
          Cards com SpotlightCard + grid 4+3 centralizado.
          CTAs ("Fazer manifestação" e "Consultar protocolo") no rodapé
          desta seção — após o usuário ver as opções disponíveis.
      ────────────────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-4"
        style={{ background: "linear-gradient(180deg, #F8F9FC 0%, #FFFFFF 100%)" }}
        id="manifestacoes"
      >
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#D4E6FF", color: "#1351B4" }}
            >
              Tipos de manifestação
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1B1B1B]">
              O que você quer{" "}
              <span style={{ color: "#1351B4" }}>fazer hoje?</span>
            </h2>
            <p className="text-base text-[#6B6B6B] max-w-xl mx-auto leading-relaxed">
              Escolha o tipo de manifestação que melhor descreve sua situação.
              Todos os canais são gratuitos e têm prazo legal de resposta.
            </p>
          </div>

          {/* Row 1 — 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIPOS_ROW1.map((tipo) => {
              const Icon = tipo.icon;
              return (
                <Link href="/login" key={tipo.label} className="group h-full">
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
                </Link>
              );
            })}
          </div>

          {/* Row 2 — 3 cards centered */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5 lg:w-[calc(75%-0.375rem)] lg:mx-auto">
            {TIPOS_ROW2.map((tipo) => {
              const Icon = tipo.icon;
              return (
                <Link href="/login" key={tipo.label} className="group h-full">
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
                </Link>
              );
            })}
          </div>

          {/* ── CTAs — posicionados ABAIXO dos cards, após o usuário ver as opções ── */}
          <div className="mt-14 flex flex-col items-center gap-4">
            <p className="text-sm text-[#6B6B6B] mb-2">
              Prazo legal de até{" "}
              <strong className="text-[#1351B4]">20 dias úteis</strong>{" "}
              para resposta · Serviço 100% gratuito
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Link href="/login" className="flex-1">
                <Button
                  size="lg"
                  fullWidth
                  className="font-bold text-base shadow-md shadow-[#1351b4]/20"
                >
                  <Plus className="w-5 h-5" />
                  Fazer uma manifestação
                </Button>
              </Link>
              <Link href="/consultar-protocolo" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  className="font-semibold text-base"
                >
                  <Search className="w-5 h-5" />
                  Consultar protocolo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: Como Funciona ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white" id="como-funciona">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "#1351B4" }}
            >
              Como funciona
            </h2>
            <p className="text-[#6B6B6B]">
              Processo simples e transparente, do registro à resposta.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PASSOS.map((passo) => (
              <div key={passo.num} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg"
                  style={{ background: "#1351B4" }}
                >
                  {passo.num}
                </div>
                <h3 className="font-semibold mb-2 text-sm text-[#1B1B1B]">{passo.titulo}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{passo.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 4: Garantias ─────────────────────────────────────────── */}
      <section
        style={{ background: "#1351B4" }}
        className="py-12 px-4 text-white"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Clock,        text: "Prazo de resposta de até 20 dias úteis" },
              { icon: Shield,       text: "Dados protegidos pela LGPD" },
              { icon: CheckCircle,  text: "Serviço público gratuito" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex flex-col items-center gap-3">
                  <Icon className="w-8 h-8 opacity-90" />
                  <p className="text-sm font-medium text-white/90">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
