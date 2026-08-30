import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { profiles, type Profile } from "@/lib/db/schema";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

function readAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string) {
  const allowlist = readAdminEmails();
  if (allowlist.length === 0) {
    return true;
  }

  return allowlist.includes(email.toLowerCase());
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  if (!user?.id || !user.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name || user.email.split("@")[0],
  };
}

export async function ensureProfile(user: AuthUser): Promise<Profile> {
  const db = getDb();
  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const [created] = await db
    .insert(profiles)
    .values({
      userId: user.id,
      email: user.email,
      name: user.name,
      isAdmin: isAdminEmail(user.email),
    })
    .returning();

  return created;
}

export async function getCurrentProfile() {
  const user = await getAuthUser();
  if (!user) {
    return { user: null, profile: null };
  }

  const profile = await ensureProfile(user);
  return { user, profile };
}

export async function requireUser() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("You need to sign in first.");
  }

  const profile = await ensureProfile(user);
  return { user, profile };
}

export async function requireAdmin() {
  const session = await requireUser();
  if (!session.profile.isAdmin && !isAdminEmail(session.user.email)) {
    throw new Error("Admin access required.");
  }

  return session;
}
