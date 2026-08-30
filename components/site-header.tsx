import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import { signOutAction } from "@/lib/actions";

export async function SiteHeader() {
  const { user, profile } = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-black text-[#04110b]">
            ₵
          </span>
          <span className="text-sm font-semibold tracking-tight">
            CKB Earn
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/" className="hover:text-foreground">
            Bounties
          </Link>
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          {profile?.isAdmin ? (
            <Link href="/admin" className="hover:text-foreground">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="hidden text-sm text-muted hover:text-foreground sm:block"
              >
                {profile?.name || user.name}
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="text-sm text-muted hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-accent px-3.5 py-1.5 text-sm font-semibold text-[#04110b]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
