"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  try {
    await auth.api.signInEmail({
      body: {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      },
    });
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Could not sign in. Try again.",
    };
  }

  redirect("/");
}
