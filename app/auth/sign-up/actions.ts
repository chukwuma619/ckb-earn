"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !name || !password) {
    return { error: "Name, email, and password are required." };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        name,
        password,
      },
    });
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not create your account.",
    };
  }

  redirect("/profile");
}
