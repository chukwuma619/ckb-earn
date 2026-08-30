import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import { signOutAction } from "@/lib/actions";

export async function SiteHeader() {
  const { user, profile } = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-[70rem] items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded bg-brand text-[11px] font-bold text-white">
              E
            </span>
            <span className="text-sm font-semibold text-slate-800">
              CKB Earn
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-500 md:flex">
            <Link href="/" className="hover:text-slate-800">
              Bounties
            </Link>
            <Link href="/?type=project" className="hover:text-slate-800">
              Projects
            </Link>
            <Link href="/dashboard" className="hover:text-slate-800">
              Dashboard
            </Link>
            {profile?.isAdmin ? (
              <Link href="/admin" className="hover:text-slate-800">
                Admin
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={user ? "/admin/bounties/new" : "/auth/sign-in"}
            className="hidden text-sm font-medium text-slate-500 hover:text-slate-800 sm:block"
          >
            Become a Sponsor
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                className="hidden text-sm text-slate-500 hover:text-slate-800 sm:block"
              >
                {profile?.name || user.name}
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="text-sm font-medium text-slate-500 hover:text-slate-800"
              >
                Login
              </Link>
              <Link
                href="/auth/sign-up"
                className="btn rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white"
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
