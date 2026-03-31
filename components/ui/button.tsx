"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#1351B4] text-white hover:bg-[#0D3F8F] active:bg-[#071D41] focus-visible:ring-[#1351B4]/40",
        outline:
          "border-[#1351B4] bg-transparent text-[#1351B4] hover:bg-[#1351B4]/10 active:bg-[#1351B4]/20 focus-visible:ring-[#1351B4]/40",
        ghost:
          "bg-transparent text-[#1351B4] hover:bg-[#1351B4]/10 active:bg-[#1351B4]/20 focus-visible:ring-[#1351B4]/40",
        accent:
          "bg-[#FFCD07] text-[#1B1B1B] hover:bg-[#F0BE00] active:bg-[#DBA800] focus-visible:ring-[#FFCD07]/50",
        success:
          "bg-[#168821] text-white hover:bg-[#0F6518] active:bg-[#084A11] focus-visible:ring-[#168821]/40",
        "success-outline":
          "border-[#168821] bg-transparent text-[#168821] hover:bg-[#168821]/10 focus-visible:ring-[#168821]/40",
        destructive:
          "bg-[#E52207] text-white hover:bg-[#C01A05] active:bg-[#9A1304] focus-visible:ring-[#E52207]/40",
        "destructive-outline":
          "border-[#E52207] bg-transparent text-[#E52207] hover:bg-[#E52207]/10 focus-visible:ring-[#E52207]/40",
        warning:
          "bg-[#E06200] text-white hover:bg-[#B84F00] active:bg-[#8F3D00] focus-visible:ring-[#E06200]/40",
        secondary:
          "bg-[#F0F0F0] text-[#1B1B1B] border-[#CCCCCC] hover:bg-[#E0E0E0] active:bg-[#CCCCCC] focus-visible:ring-[#6B6B6B]/30",
        dark:
          "bg-[#071D41] text-white hover:bg-[#0D3F8F] active:bg-[#1351B4] focus-visible:ring-[#071D41]/40",
        link: "text-[#1351B4] underline-offset-4 hover:underline focus-visible:ring-[#1351B4]/40",
      },
      size: {
        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg font-semibold",
        icon: "size-10",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
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
