import { cn } from "@/lib/utils";

export function Logo({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width="20"
      height="20"
      aria-hidden
      className={cn("size-5 shrink-0 text-reactor", className)}
      {...props}
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
      <path
        d="M12 5.5V8.5M12 15.5V18.5M5.5 12H8.5M15.5 12H18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
