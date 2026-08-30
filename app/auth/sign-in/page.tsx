"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInWithEmail } from "./actions";

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">
        Sign in to submit work and track CKB payouts.
      </p>
      <form action={formAction} className="mt-8 space-y-4">
        <label className="block text-xs text-muted">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
        <label className="block text-xs text-muted">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
        {state?.error ? (
          <p className="text-sm text-danger">{state.error}</p>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-[#04110b] disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link href="/auth/sign-up" className="text-accent">
          Create an account
        </Link>
      </p>
    </main>
  );
}
