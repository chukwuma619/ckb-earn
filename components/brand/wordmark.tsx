import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export function BrandWordmark({
  href = "/",
  className,
  markClassName,
  labelClassName,
  size = "default",
  invert = false,
}: {
  href?: string;
  className?: string;
  markClassName?: string;
  labelClassName?: string;
  size?: "default" | "lg" | "hero" | "sm";
  invert?: boolean;
}) {
  const labelSize =
    size === "hero"
      ? "text-5xl sm:text-6xl"
      : size === "lg"
        ? "text-[1.8rem]"
        : size === "sm"
          ? "text-[1.05rem]"
          : "text-[1.2rem]";

  const markSize =
    size === "hero"
      ? "size-12"
      : size === "lg"
        ? "size-8"
        : size === "sm"
          ? "size-4"
          : "size-5";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-display font-extrabold tracking-tight",
        invert ? "text-stone" : "text-slate",
        className,
      )}
    >
      <Logo
        className={cn(
          "shrink-0",
          markSize,
          invert ? "text-spark" : "text-reactor",
          markClassName,
        )}
      />
      <span className={cn(labelSize, labelClassName)}>
        CKB Earn
      </span>
    </Link>
  );
}
