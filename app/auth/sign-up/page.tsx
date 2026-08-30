"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpWithEmail } from "./actions";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-sm flex-col justify-center px-4">
      <h1 className="text-xl font-semibold text-slate-800">Sign Up</h1>
      <p className="mt-1 text-sm text-slate-500">
        One profile for CKB bounties and projects.
      </p>
      <form action={formAction} className="mt-6 space-y-3">
        <input
          name="name"
          required
          placeholder="Name"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
        {state?.error ? (
          <p className="text-sm text-danger">{state.error}</p>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="btn w-full rounded-md bg-brand py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isPending ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-medium text-slate-800">
          Login
        </Link>
      </p>
    </main>
  );
}
