"use client";

/**
 * HeroGovBR — Seção hero do Portal da Ouvidoria Digital
 *
 * Estrutura inspirada no hero-dithering-card (rounded-[48px] card),
 * com imagem real no lugar da animação Dithering.
 *
 * Layout: split — texto (esquerda) + foto cidadão (direita)
 * Fundo: azul institucional #071d41 (GOV.BR darkest)
 * Tipografia: Raleway (Rawline fallback oficial DSGOV)
 * Sem botões CTA — foco total na mensagem e na hierarquia visual
 */

import Image from "next/image";
import { useState } from "react";
import { ShieldCheck, Clock3, Smartphone } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "100% Seguro e gratuito" },
  { icon: Clock3,      label: "Resposta em até 20 dias úteis" },
  { icon: Smartphone,  label: "Funciona pelo celular" },
];

export function HeroGovBR() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="w-full px-4 md:px-6 py-6 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto">
        {/*
         * Card principal — estrutura do hero-dithering-card
         * rounded-[48px] · border · overflow-hidden · min-h definida
         */}
        <div className="relative overflow-hidden rounded-[40px] md:rounded-[48px] border border-[#0D3F8F]/40 bg-[#071d41] min-h-[480px] md:min-h-[560px] flex flex-col md:flex-row items-stretch shadow-2xl">

          {/* ── Coluna esquerda: conteúdo ───────────────────────────────── */}
          <div className="relative z-10 flex flex-col justify-center px-8 sm:px-12 md:px-16 py-14 md:py-0 flex-1">

            {/* Badge GOV.BR — pulsing dot (do hero-dithering-card) */}
            <div className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-[#ffcd07] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffcd07] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffcd07]" />
              </span>
              Portal do Cidadão · GOV.BR
            </div>

            {/* Headline principal */}
            <h1 className="text-white font-bold leading-[1.1] tracking-tight mb-6 text-[clamp(2rem,5vw,3.5rem)]">
              Sua voz chega<br />
              <span className="text-[#ffcd07]">onde precisa.</span>
            </h1>

            {/* Subtítulo — texto que estimula o uso */}
            <p className="text-white/75 leading-relaxed mb-8 max-w-lg text-[clamp(0.95rem,2vw,1.1rem)]">
              Passou por um mau atendimento? Viu algo errado no seu bairro?
              Tem uma ideia para melhorar um serviço público? Este é o seu
              canal direto com o governo — registre sua manifestação agora,
              sem burocracia, pelo celular ou computador.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-white/70 text-sm"
                >
                  <Icon className="w-4 h-4 text-[#ffcd07] shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Coluna direita: imagem do cidadão ──────────────────────── */}
          <div className="relative w-full md:w-[45%] min-h-[260px] md:min-h-0 overflow-hidden">
            {/* Gradiente de fusão lateral (esquerda) */}
            <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#071d41] to-transparent pointer-events-none" />
            {/* Gradiente de fusão inferior (mobile) */}
            <div className="absolute inset-x-0 top-0 h-20 z-10 bg-gradient-to-b from-[#071d41] to-transparent pointer-events-none md:hidden" />

            {!imgError ? (
              <Image
                src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=900&q=85"
                alt="Cidadã brasileira usando o celular para acessar serviços públicos"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
                priority
                onError={() => setImgError(true)}
              />
            ) : (
              /* Fallback se a imagem não carregar */
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=85"
                alt="Cidadão brasileiro usando smartphone para buscar informações"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
                priority
              />
            )}

            {/* Overlay sutil de cor para integrar com o fundo azul */}
            <div className="absolute inset-0 bg-[#1351b4]/15 mix-blend-multiply pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
