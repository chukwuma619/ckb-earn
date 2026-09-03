import { cookies } from "next/headers";
import {
  DEMO_AUTH_COOKIE,
  DEMO_USER,
  getStore,
} from "@/lib/data/store";
import type { Profile } from "@/lib/types";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export function isAdminEmail(email: string) {
  return email.toLowerCase() === DEMO_USER.email.toLowerCase();
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const jar = await cookies();
  if (jar.get(DEMO_AUTH_COOKIE)?.value !== "1") {
    return null;
  }

  return {
    id: DEMO_USER.id,
    email: DEMO_USER.email,
    name: DEMO_USER.name,
  };
}

export async function ensureProfile(user: AuthUser): Promise<Profile> {
  const store = getStore();
  const existing = store.profiles.find((profile) => profile.userId === user.id);
  if (existing) {
    return existing;
  }

  const created: Profile = {
    userId: user.id,
    email: user.email,
    name: user.name,
    bio: "",
    ckbAddress: "",
    twitter: "",
    skills: "",
    isAdmin: isAdminEmail(user.email),
    role: "member",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  store.profiles.push(created);
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

export async function setDemoSession() {
  const jar = await cookies();
  jar.set(DEMO_AUTH_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearDemoSession() {
  const jar = await cookies();
  jar.delete(DEMO_AUTH_COOKIE);
}
