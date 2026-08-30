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
    <main className="mx-auto w-full max-w-xl px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        Reviewers use this to pay you in CKB after you win.
      </p>
      <form action={updateProfileAction} className="mt-6 space-y-4">
        <label className="block text-xs font-medium text-slate-500">
          Display name
          <input
            name="name"
            defaultValue={profile.name}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <label className="block text-xs font-medium text-slate-500">
          CKB address
          <input
            name="ckbAddress"
            defaultValue={profile.ckbAddress}
            placeholder="ckt1… or ckb1…"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <label className="block text-xs font-medium text-slate-500">
          X / Twitter
          <input
            name="twitter"
            defaultValue={profile.twitter}
            placeholder="@handle"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <label className="block text-xs font-medium text-slate-500">
          Skills
          <input
            name="skills"
            defaultValue={profile.skills}
            placeholder="Writing, design, Rust, Fiber"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <label className="block text-xs font-medium text-slate-500">
          Bio
          <textarea
            name="bio"
            rows={5}
            defaultValue={profile.bio}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <button
          type="submit"
          className="btn rounded-md bg-brand px-4 py-2 text-sm font-medium text-white"
        >
          Save
        </button>
      </form>
    </main>
  );
}
