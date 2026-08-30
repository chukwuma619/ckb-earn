import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { updateProfileAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { user, profile } = await getCurrentProfile();
  if (!user || !profile) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Talent profile</h1>
      <p className="mt-2 text-sm text-muted">
        Reviewers use this to pay you in CKB after you win.
      </p>
      <form action={updateProfileAction} className="mt-8 space-y-4">
        <label className="block text-xs text-muted">
          Display name
          <input
            name="name"
            defaultValue={profile.name}
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
        <label className="block text-xs text-muted">
          CKB address
          <input
            name="ckbAddress"
            defaultValue={profile.ckbAddress}
            placeholder="ckt1… or ckb1…"
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
        <label className="block text-xs text-muted">
          X / Twitter
          <input
            name="twitter"
            defaultValue={profile.twitter}
            placeholder="@handle"
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
        <label className="block text-xs text-muted">
          Skills
          <input
            name="skills"
            defaultValue={profile.skills}
            placeholder="Writing, design, Rust, Fiber"
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
        <label className="block text-xs text-muted">
          Bio
          <textarea
            name="bio"
            rows={5}
            defaultValue={profile.bio}
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-[#04110b]"
        >
          Save profile
        </button>
      </form>
    </main>
  );
}
