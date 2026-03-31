"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Button — padrão DSGOV (Design System do Governo Federal)
 *
 * Especificações:
 * - Fonte: Rawline / Raleway (sans-serif)
 * - Border-radius: 100px (pill) — padrão GOV.BR
 * - Foco: outline #c2850c (gold-vivid-40) — acessibilidade WCAG
 * - Disabled: opacity 0.45 — padrão DSGOV
 * - Hover: escurecimento do fundo (~10%)
 * - Grid de espaçamento: múltiplos de 8px
 *
 * Refs:
 *   https://www.gov.br/ds/components/button
 *   https://www.gov.br/ds/fundamentos-visuais/cores
 */

const buttonVariants = cva(
  [
    // Base — fonte e layout
    "inline-flex items-center justify-center gap-2",
    "font-semibold whitespace-nowrap select-none",
    "transition-all duration-200 ease-in-out",
    "outline-none cursor-pointer",
    // Pill — padrão GOV.BR (surface-rounder-pill)
    "rounded-[100px]",
    // Foco acessível — ouro GOV.BR (gold-vivid-40)
    "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#c2850c]",
    // Disabled — opacity 0.45 (padrão DSGOV)
    "disabled:pointer-events-none disabled:opacity-45",
    // Ícones
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        // ── Primário — azul GOV.BR #1351b4 ──────────────────────────────
        default:
          "bg-[#1351b4] text-white border-2 border-transparent hover:bg-[#0c326f] active:bg-[#071d41]",

        // ── Outline — borda azul GOV.BR ──────────────────────────────────
        outline:
          "bg-transparent text-[#1351b4] border-2 border-[#1351b4] hover:bg-[#1351b4]/10 active:bg-[#1351b4]/20",

        // ── Ghost — sem borda, apenas hover colorido ──────────────────────
        ghost:
          "bg-transparent text-[#1351b4] border-2 border-transparent hover:bg-[#1351b4]/10 active:bg-[#1351b4]/15",

        // ── Amarelo — destaque/call-to-action GOV.BR (#ffcd07) ───────────
        accent:
          "bg-[#ffcd07] text-[#1b1b1b] border-2 border-transparent hover:bg-[#d4a017] active:bg-[#b8891a] font-bold",

        // ── Verde — sucesso / confirmar (#168821) ────────────────────────
        success:
          "bg-[#168821] text-white border-2 border-transparent hover:bg-[#0f6518] active:bg-[#084a11]",

        // ── Verde outline ─────────────────────────────────────────────────
        "success-outline":
          "bg-transparent text-[#168821] border-2 border-[#168821] hover:bg-[#168821]/10 active:bg-[#168821]/20",

        // ── Vermelho — destrutivo (#e52207) ──────────────────────────────
        destructive:
          "bg-[#e52207] text-white border-2 border-transparent hover:bg-[#c01a05] active:bg-[#9a1304]",

        // ── Vermelho outline ──────────────────────────────────────────────
        "destructive-outline":
          "bg-transparent text-[#e52207] border-2 border-[#e52207] hover:bg-[#e52207]/10 active:bg-[#e52207]/20",

        // ── Laranja — aviso (#e06200) ─────────────────────────────────────
        warning:
          "bg-[#e06200] text-white border-2 border-transparent hover:bg-[#b84f00] active:bg-[#8f3d00]",

        // ── Cinza — secundário neutro ─────────────────────────────────────
        secondary:
          "bg-[#f0f0f0] text-[#1b1b1b] border-2 border-[#cccccc] hover:bg-[#e0e0e0] active:bg-[#cccccc]",

        // ── Azul escuro — institucional / sidebar ─────────────────────────
        dark:
          "bg-[#071d41] text-white border-2 border-transparent hover:bg-[#0c326f] active:bg-[#1351b4]",

        // ── Link — texto puro com underline ──────────────────────────────
        link:
          "bg-transparent text-[#1351b4] border-2 border-transparent underline-offset-4 hover:underline rounded-[4px]",
      },
      size: {
        // Tamanhos baseados no grid de 8px do DSGOV
        xs:      "h-7  px-3  text-xs  gap-1   [&_svg:not([class*='size-'])]:size-3",
        sm:      "h-8  px-4  text-sm  gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-10 px-6  text-sm  gap-2",
        lg:      "h-12 px-8  text-base gap-2",
        xl:      "h-14 px-10 text-lg  gap-2  font-bold",
        // Ícone (quadrado)
        "icon-xs":  "size-7  rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":  "size-8  rounded-full [&_svg:not([class*='size-'])]:size-4",
        "icon":     "size-10 rounded-full",
        "icon-lg":  "size-12 rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  fullWidth?: boolean
}

function Button({
  className,
  variant = "default",
  size = "default",
  fullWidth,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
