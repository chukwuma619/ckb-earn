import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import { signOutAction } from "@/lib/actions";

export async function SiteHeader() {
  const { user, profile } = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded bg-foreground text-xs font-black text-background">
              C
            </span>
            <span className="text-base font-bold text-foreground">
              CKB Catalyst
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted md:flex">
            <Link href="/" className="hover:text-foreground transition-colors">
              Bounties
            </Link>
            <Link href="/?type=grant" className="hover:text-foreground transition-colors">
              Grants
            </Link>
            <Link href="/?type=spark" className="hover:text-foreground transition-colors">
              Spark
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            {profile?.role === "reviewer" || profile?.role === "committee" || profile?.isAdmin ? (
              <Link href="/admin" className="hover:text-accent transition-colors">
                Admin
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={user ? "/admin/bounties/new" : "/auth/sign-in"}
            className="hidden text-sm font-semibold text-muted hover:text-foreground sm:block transition-colors"
          >
            Become a Sponsor
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                className="hidden text-sm font-medium text-foreground sm:block"
              >
                {profile?.name || user.name}
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md px-3 py-1.5 text-sm font-semibold text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="text-sm font-semibold text-muted hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/sign-up"
                className="btn rounded-md bg-accent px-4 py-2 text-sm font-bold text-black hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
