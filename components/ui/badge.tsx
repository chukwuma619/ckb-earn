import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[4px] border border-transparent px-2 py-0.5 font-display text-[0.7rem] font-bold tracking-wide uppercase whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-reactor text-void [a]:hover:bg-reactor-hot",
        secondary:
          "bg-stone-2 text-slate [a]:hover:bg-stone-3 dark:bg-void-mid dark:text-stone",
        destructive:
          "bg-hard/10 text-hard focus-visible:ring-destructive/20 dark:bg-hard/20 [a]:hover:bg-hard/20",
        outline:
          "border-slate/15 text-slate [a]:hover:bg-stone-2 dark:border-stone/20 dark:text-stone",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-reactor underline-offset-4 hover:underline",
        spark: "bg-spark-wash text-slate border-spark/40 [a]:hover:bg-spark/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
