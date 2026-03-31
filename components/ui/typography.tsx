import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import React from "react"

const typographyVariants = cva("", {
  variants: {
    variant: {
      // Display — hero sections
      display:
        "scroll-m-20 text-5xl font-extrabold tracking-tight leading-tight",
      // Headings
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight leading-tight",
      h2: "scroll-m-20 text-3xl font-bold tracking-tight leading-snug",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight leading-snug",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      // Body
      "body-lg": "text-lg leading-7",
      body: "text-base leading-7",
      "body-sm": "text-sm leading-6",
      "body-xs": "text-xs leading-5",
      // Especiais
      lead: "text-xl font-medium text-[#6B6B6B] leading-8",
      muted: "text-sm text-[#6B6B6B] leading-6",
      label: "text-sm font-medium leading-none",
      caption: "text-xs text-[#6B6B6B] leading-4",
      overline:
        "text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]",
      code: "font-mono text-sm bg-[#F0F0F0] rounded px-1.5 py-0.5",
    },
    color: {
      default: "text-[#1B1B1B]",
      primary: "text-[#1351B4]",
      muted: "text-[#6B6B6B]",
      success: "text-[#168821]",
      warning: "text-[#E06200]",
      destructive: "text-[#E52207]",
      accent: "text-[#FFCD07]",
      white: "text-white",
      inherit: "text-inherit",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
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
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  "body-lg": "p",
  body: "p",
  "body-sm": "p",
  "body-xs": "p",
  lead: "p",
  muted: "p",
  label: "span",
  caption: "span",
  overline: "span",
  code: "code",
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
