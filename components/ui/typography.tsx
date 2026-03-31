/**
 * Typography — padrão DSGOV (Design System do Governo Federal)
 *
 * Escala tipográfica modular 1.2x com base em 14px:
 *   down-1 → 11.66px  (anotações, microcopy)
 *   base   → 14px     (body padrão)
 *   up-1   → 16.8px   (body destaque)
 *   up-2   → 20.16px  (h4/h5)
 *   up-3   → 24.19px  (h3)
 *   up-4   → 29.03px  (h2)
 *   up-5   → 34.83px  (h1)
 *   up-6   → 41.80px  (display)
 *   up-7   → 50.16px  (display hero)
 *
 * Fonte: Rawline → Raleway → sans-serif
 * Refs: https://www.gov.br/ds/fundamentos-visuais/tipografia
 */

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import React from "react"

const typographyVariants = cva("", {
  variants: {
    variant: {
      // ── Display / Hero ──────────────────────────────────────────────────
      // DSGOV up-7: 50.16px, extrabold, line-height low (1.15)
      display:
        "text-[50px] font-extrabold leading-[1.15] tracking-tight",

      // ── Headings — escala DSGOV ─────────────────────────────────────────
      // h1 → up-5: 34.83px semibold
      h1: "text-[35px] font-semibold leading-[1.15] tracking-tight",
      // h2 → up-4: 29.03px semibold
      h2: "text-[29px] font-semibold leading-[1.15] tracking-tight",
      // h3 → up-3: 24.19px semibold
      h3: "text-[24px] font-semibold leading-[1.25] tracking-tight",
      // h4 → up-2: 20.16px semibold
      h4: "text-[20px] font-semibold leading-[1.35]",
      // h5 → up-1: 16.8px semibold
      h5: "text-[17px] font-semibold leading-[1.35]",
      // h6 → base: 14px semibold
      h6: "text-[14px] font-semibold leading-[1.45]",

      // ── Body — escala DSGOV ─────────────────────────────────────────────
      // body-lg → up-1: 16.8px regular
      "body-lg": "text-[17px] font-normal leading-[1.85]",
      // body → base: 14px regular (padrão DSGOV)
      body:      "text-[14px] font-normal leading-[1.45]",
      // body-sm → down-1: 11.66px regular
      "body-sm": "text-[12px] font-normal leading-[1.45]",
      // body-xs → microcopy
      "body-xs": "text-[11px] font-normal leading-[1.45]",

      // ── Estilos especiais DSGOV ─────────────────────────────────────────
      // lead: introdutório, up-1 medium
      lead:     "text-[17px] font-medium leading-[1.85] text-[#6b6b6b]",
      // muted: informação secundária, base light
      muted:    "text-[14px] font-normal leading-[1.45] text-[#6b6b6b]",
      // label: rótulo de formulário, base medium
      label:    "text-[14px] font-medium leading-none",
      // caption: legenda, down-1
      caption:  "text-[12px] font-normal leading-[1.45] text-[#6b6b6b]",
      // overline: categoria/seção, down-1 semibold uppercase
      overline: "text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b6b6b]",
      // code: mono
      code:     "font-mono text-[13px] bg-[#f0f0f0] rounded-[4px] px-1.5 py-0.5 text-[#1b1b1b]",
    },

    color: {
      default:     "text-[#1b1b1b]",
      primary:     "text-[#1351b4]",
      muted:       "text-[#6b6b6b]",
      success:     "text-[#168821]",
      warning:     "text-[#e06200]",
      destructive: "text-[#e52207]",
      accent:      "text-[#ffcd07]",
      white:       "text-white",
      inherit:     "text-inherit",
    },

    align: {
      left:   "text-left",
      center: "text-center",
      right:  "text-right",
    },

    truncate: {
      true: "truncate",
    },

    balance: {
      true: "text-balance",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
  },
})

type VariantTagMap = {
  [key: string]: keyof React.JSX.IntrinsicElements
}

const variantTagMap: VariantTagMap = {
  display:   "h1",
  h1:        "h1",
  h2:        "h2",
  h3:        "h3",
  h4:        "h4",
  h5:        "h5",
  h6:        "h6",
  "body-lg": "p",
  body:      "p",
  "body-sm": "p",
  "body-xs": "p",
  lead:      "p",
  muted:     "p",
  label:     "span",
  caption:   "span",
  overline:  "span",
  code:      "code",
}

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: keyof React.JSX.IntrinsicElements
}

function Typography({
  className,
  variant = "body",
  color,
  align,
  truncate,
  balance,
  as,
  children,
  ...props
}: TypographyProps) {
  const Tag = (as ?? variantTagMap[variant ?? "body"] ?? "p") as React.ElementType

  return (
    <Tag
      className={cn(
        typographyVariants({ variant, color, align, truncate, balance }),
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export { Typography, typographyVariants }
