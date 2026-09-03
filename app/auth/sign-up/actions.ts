"use server";

import { redirect } from "next/navigation";
import { setDemoSession } from "@/lib/auth/session";

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  _formData: FormData,
): Promise<{ error: string } | null> {
  await setDemoSession();
  redirect("/profile");
}
