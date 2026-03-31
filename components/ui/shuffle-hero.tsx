"use client";

/**
 * ShuffleHero — Hero da Ouvidoria Digital
 *
 * Baseado no componente shuffle-hero.tsx com framer-motion.
 * Adaptado para o padrão DSGOV (Design System do Governo Federal).
 *
 * Esquerda: texto hierárquico + CTA principal
 * Direita: grade 4×4 com shuffle de imagens de cidadãos brasileiros
 *          (diversidade: homens, mulheres, negros, adolescentes, idosos)
 */

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Clock3, Smartphone, Plus } from "lucide-react";

interface Square {
  id: number;
  src: string;
  alt: string;
}

// ── Cidadãos brasileiros — fotos locais com diversidade de gênero, raça e idade ──
const squareData: Square[] = [
  {
    id: 1,
    src: "/cidadaos/mulher-negra.avif",
    alt: "Mulher negra brasileira",
  },
  {
    id: 2,
    src: "/cidadaos/mulher-negra-2.avif",
    alt: "Mulher negra brasileira sorrindo",
  },
  {
    id: 3,
    src: "/cidadaos/mulher-negra-3.avif",
    alt: "Mulher negra jovem",
  },
  {
    id: 4,
    src: "/cidadaos/mulher-branca.avif",
    alt: "Mulher branca brasileira",
  },
  {
    id: 5,
    src: "/cidadaos/mulher-branca-2.avif",
    alt: "Mulher branca jovem",
  },
  {
    id: 6,
    src: "/cidadaos/mulher-branca-3.avif",
    alt: "Mulher branca sorrindo",
  },
  {
    id: 7,
    src: "/cidadaos/homem-negro-1.avif",
    alt: "Homem negro brasileiro",
  },
  {
    id: 8,
    src: "/cidadaos/homem-negro-2.avif",
    alt: "Homem negro jovem",
  },
  {
    id: 9,
    src: "/cidadaos/homem-expressivo.avif",
    alt: "Homem fazendo gestos expressivos",
  },
  {
    id: 10,
    src: "/cidadaos/idosa-negra-1.avif",
    alt: "Idosa negra brasileira",
  },
  {
    id: 11,
    src: "/cidadaos/idosa-negra-2.avif",
    alt: "Idosa negra sorrindo",
  },
  {
    id: 12,
    src: "/cidadaos/idoso-branco.avif",
    alt: "Idoso branco brasileiro",
  },
  {
    id: 13,
    src: "/cidadaos/idoso-branco-1.avif",
    alt: "Idoso branco com celular",
  },
  {
    id: 14,
    src: "/cidadaos/idoso-negro-1.avif",
    alt: "Idoso negro brasileiro",
  },
  {
    id: 15,
    src: "/cidadaos/idoso-celular.jpg",
    alt: "Idoso acessando serviços pelo celular",
  },
  {
    id: 16,
    src: "/cidadaos/indigena-guarani.jpg",
    alt: "Cidadão indígena da etnia Guarani",
  },
  {
    id: 17,
    src: "/cidadaos/pessoa-lgbtq.avif",
    alt: "Pessoa comemorando diversidade",
  },
  {
    id: 18,
    src: "/cidadaos/idoso-negro-2.avif",
    alt: "Idoso negro sorrindo",
  },
];

const shuffle = (array: Square[]): Square[] => {
  const arr = [...array];
  let currentIndex = arr.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
};

const generateSquares = () =>
  shuffle(squareData).slice(0, 16).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      role="img"
      aria-label={sq.alt}
    />
  ));

const ShuffleGrid = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [squares, setSquares] = useState(generateSquares);

  useEffect(() => {
    const shuffleSquares = () => {
      setSquares(generateSquares());
      timeoutRef.current = setTimeout(shuffleSquares, 3000);
    };
    shuffleSquares();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[380px] md:h-[460px] gap-1.5">
      {squares}
    </div>
  );
};

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "100% gratuito e seguro" },
  { icon: Clock3,      label: "Resposta em até 20 dias úteis" },
  { icon: Smartphone,  label: "Funciona pelo celular" },
];

export const ShuffleHero = () => {
  return (
    <section className="w-full px-4 md:px-8 py-14 md:py-20 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 max-w-6xl mx-auto">

        {/* ── Coluna esquerda: conteúdo textual + CTA ───────────────────── */}
        <div className="flex flex-col">

          {/* Badge GOV.BR com pulsing dot */}
          <div className="mb-5 inline-flex items-center gap-2 self-start rounded-full border border-[#1351b4]/20 bg-[#d4e6ff] px-4 py-1.5 text-sm font-semibold text-[#1351b4]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1351b4] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1351b4]" />
            </span>
            Portal do Cidadão · GOV.BR
          </div>

          {/* H1 — headline principal DSGOV */}
          <h1 className="text-[clamp(2.2rem,5vw,3.2rem)] font-bold leading-[1.1] tracking-tight text-[#1b1b1b] mb-5">
            Sua voz chega<br />
            <span className="text-[#1351b4]">onde precisa.</span>
          </h1>

          {/* Subtítulo motivador */}
          <p className="text-[#6b6b6b] leading-relaxed mb-8 max-w-lg text-[clamp(0.95rem,2vw,1.05rem)]">
            Recebeu um mau atendimento? Viu algo errado no seu bairro?
            Tem uma ideia para melhorar um serviço público? Este é o seu
            canal direto com o governo — registre agora, sem burocracia,
            de onde estiver.
          </p>

          {/* Trust indicators — DSGOV: ícone + texto curto */}
          <div className="flex flex-col gap-2.5 mb-10">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-[14px] text-[#1b1b1b]">
                <div className="w-6 h-6 rounded-full bg-[#d4e6ff] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#1351b4]" />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* CTA principal — pill, destaque, padrão DSGOV */}
          <Link href="/login" className="self-start">
            <button
              className={[
                "inline-flex items-center gap-2.5",
                "bg-[#1351b4] text-white font-bold",
                "rounded-[100px] px-8 py-3.5 text-base",
                "shadow-lg shadow-[#1351b4]/30",
                "transition-all duration-200",
                "hover:bg-[#0c326f] hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1351b4]/40",
                "active:scale-95",
                "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#c2850c]",
              ].join(" ")}
            >
              <Plus className="w-5 h-5" />
              Registrar manifestação
            </button>
          </Link>
        </div>

        {/* ── Coluna direita: grade shuffling de cidadãos ───────────────── */}
        <div className="hidden md:block">
          <ShuffleGrid />
        </div>
      </div>
    </section>
  );
};

export default ShuffleHero;
