import type { Metadata } from "next";
import { IBM_Plex_Mono, Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

const display = Outfit({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CKB Earn",
  description:
    "Bounties and projects for the Nervos CKB ecosystem. One profile. Paid in CKB.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(display.variable, mono.variable, "h-full antialiased")}
    >
      <body className="flex min-h-full flex-col font-sans text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:bg-reactor focus:px-3 focus:py-2 focus:font-display focus:text-sm focus:font-bold focus:text-void"
            >
              Skip to main content
            </a>
            <SiteHeader />
            <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </div>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
