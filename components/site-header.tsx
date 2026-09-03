import Link from "next/link";
import { BrandWordmark } from "@/components/brand/wordmark";
import { getCurrentProfile } from "@/lib/auth/session";
import { signOutAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const { user, profile } = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-20 border-b border-slate/10 bg-stone/85 backdrop-blur-md dark:border-void-line dark:bg-void/85">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <BrandWordmark size="sm" />
          <nav className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Bounties</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/?type=grant">Grants</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            asChild
          >
            <Link href={user ? "/admin/bounties/new" : "/auth/sign-in"}>
              Become a Sponsor
            </Link>
          </Button>
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                asChild
              >
                <Link href="/profile">{profile?.name || user.name}</Link>
              </Button>
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/sign-in">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
