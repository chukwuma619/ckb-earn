import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "pressable group/button inline-flex shrink-0 items-center justify-center rounded-[4px] border border-transparent bg-clip-padding font-display text-sm font-bold tracking-tight whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-150 ease-[var(--ease-out)] outline-none select-none focus-visible:border-reactor focus-visible:ring-2 focus-visible:ring-reactor/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-reactor text-void hover:bg-reactor-hot",
        outline:
          "border-slate/15 bg-transparent text-slate hover:border-slate/40 aria-expanded:border-slate/40 dark:border-stone/20 dark:text-stone dark:hover:border-stone/40",
        secondary:
          "bg-slate text-stone hover:bg-void aria-expanded:bg-void dark:bg-stone dark:text-void dark:hover:bg-stone-2",
        ghost:
          "border-transparent bg-transparent text-slate hover:bg-stone-2 aria-expanded:bg-stone-2 dark:text-stone dark:hover:bg-void-mid",
        destructive:
          "bg-hard/10 text-hard hover:bg-hard/20 focus-visible:border-hard/40 focus-visible:ring-hard/20",
        link: "text-reactor underline-offset-4 hover:underline",
        spark: "bg-spark text-void hover:bg-spark/90",
      },
      size: {
        default:
          "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-12 gap-2 px-5 text-[1rem] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
