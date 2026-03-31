import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

const TIPOS = [
  {
    icon: AlertTriangle,
    label: "Denúncia",
    descricao: "Comunicar irregularidade na administração pública.",
    cor: "#E52207",
    bg: "#FCDBD8",
  },
  {
    icon: ThumbsUp,
    label: "Elogio",
    descricao: "Registrar satisfação com o atendimento ou serviço.",
    cor: "#168821",
    bg: "#DAF0DD",
  },
  {
    icon: FileText,
    label: "Solicitação",
    descricao: "Pedir a realização de um serviço público.",
    cor: "#1351B4",
    bg: "#D4E6FF",
  },
  {
    icon: Lightbulb,
    label: "Sugestão",
    descricao: "Sugerir melhorias nos serviços e atendimentos.",
    cor: "#9B59B6",
    bg: "#F3E8FF",
  },
  {
    icon: Layers,
    label: "Simplifique",
    descricao: "Solicitar a simplificação de serviços ou processos públicos.",
    cor: "#17A2B8",
    bg: "#D4F4F9",
  },
  {
    icon: Info,
    label: "Informação",
    descricao: "Solicitar informações sobre ações, serviços, programas, benefícios.",
    cor: "#E06200",
    bg: "#FDE8D4",
  },
  {
    icon: ThumbsDown,
    label: "Reclamação",
    descricao: "Registrar insatisfação com serviço, programa ou atendimento público.",
    cor: "#C0392B",
    bg: "#FCDBD8",
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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{ background: "linear-gradient(135deg, #071D41 0%, #1351B4 100%)" }}
        className="text-white py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
            style={{ background: "#FFCD07", color: "#1B1B1B" }}
          >
            Portal do Cidadão
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Sua voz chega onde precisa.
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Registre, acompanhe e receba resposta sobre suas manifestações à
            Assistência Social — tudo em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="px-8 font-semibold text-base"
                style={{ background: "#FFCD07", color: "#1B1B1B" }}
              >
                Fazer uma manifestação
              </Button>
            </Link>
            <Link href="/consultar-protocolo">
              <Button
                size="lg"
                variant="outline"
                className="px-8 font-semibold text-base border-white/40 text-white hover:bg-white/10"
              >
                <Search className="w-4 h-4 mr-2" />
                Consultar protocolo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tipos de Manifestação ─────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white" id="manifestacoes">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "#1351B4" }}
            >
              O que você quer fazer?
            </h2>
            <p className="text-muted-foreground">
              Selecione o tipo de manifestação que melhor representa sua situação.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TIPOS.map((tipo) => {
              const Icon = tipo.icon;
              return (
                <Link href="/login" key={tipo.label}>
                  <div className="border border-border rounded-xl p-5 bg-white hover:shadow-md transition-all cursor-pointer group h-full">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ background: tipo.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: tipo.cor }} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{tipo.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tipo.descricao}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6 italic">
            Se tiver dúvidas, passe o mouse ou toque no ícone para ver exemplos de cada opção.
          </p>
        </div>
      </section>

      {/* ── Consultar Protocolo ───────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: "#F8F8F8" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: "#1351B4" }}
          >
            Acompanhar manifestação
          </h2>
          <p className="text-muted-foreground mb-6">
            Já registrou uma demanda na ouvidoria? Insira o número de protocolo para acompanhar o andamento.
          </p>
          <Link href="/consultar-protocolo">
            <Button
              size="lg"
              className="font-semibold px-8"
              style={{ background: "#FFCD07", color: "#1B1B1B" }}
            >
              <Search className="w-4 h-4 mr-2" />
              Consultar Protocolo
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Como Funciona ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white" id="como-funciona">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "#1351B4" }}
            >
              Como funciona
            </h2>
            <p className="text-muted-foreground">
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
                <h3 className="font-semibold mb-2 text-sm">{passo.titulo}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {passo.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Garantias ─────────────────────────────────────────────────────── */}
      <section
        style={{ background: "#1351B4" }}
        className="py-12 px-4 text-white"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Clock, text: "Prazo de resposta de até 20 dias úteis" },
              { icon: Shield, text: "Dados protegidos pela LGPD" },
              { icon: CheckCircle, text: "Serviço público gratuito" },
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
