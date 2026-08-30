import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { submitToListingAction } from "@/lib/actions";
import { countSubmissions, getListingBySlug } from "@/lib/listings";
import { getUserSubmission } from "@/lib/submissions";
import {
  categoryLabel,
  formatDeadline,
  formatUsd,
  statusLabel,
  submissionStatusLabel,
  typeLabel,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BountyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) {
    notFound();
  }

  const { user } = await getCurrentProfile();
  const [submissions, existing] = await Promise.all([
    countSubmissions(listing.id),
    user ? getUserSubmission(listing.id, user.id) : Promise.resolve(null),
  ]);

  const open = listing.status === "open";

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.4fr_0.8fr]">
      <article>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {typeLabel(listing.type)} · {categoryLabel(listing.category)}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {listing.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
          <span>{statusLabel(listing.status)}</span>
          <span>{formatDeadline(listing.deadline)}</span>
          <span>
            {submissions} submission{submissions === 1 ? "" : "s"}
          </span>
          <span>
            {listing.winnerCount} winner{listing.winnerCount === 1 ? "" : "s"}
          </span>
        </div>
        <div className="mt-8 whitespace-pre-wrap text-base leading-7 text-foreground/90">
          {listing.description}
        </div>
        {listing.requirements ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold">What to submit</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">
              {listing.requirements}
            </p>
          </section>
        ) : null}
      </article>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Reward</p>
          <p className="mt-2 text-3xl font-semibold text-gold">
            {listing.rewardLabel}
          </p>
          <p className="mt-1 text-sm text-muted">{formatUsd(listing.rewardUsd)}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-base font-semibold">Submit work</h2>
          {!user ? (
            <p className="mt-3 text-sm leading-6 text-muted">
              <Link href="/auth/sign-in" className="text-accent">
                Sign in
              </Link>{" "}
              to submit. Add your CKB address on your profile before you win.
            </p>
          ) : !open ? (
            <p className="mt-3 text-sm text-muted">
              This listing is no longer accepting submissions.
            </p>
          ) : (
            <form action={submitToListingAction} className="mt-4 space-y-3">
              <input type="hidden" name="listingId" value={listing.id} />
              <label className="block text-xs text-muted">
                Work link
                <input
                  name="link"
                  required
                  defaultValue={existing?.link}
                  placeholder="https://…"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40"
                />
              </label>
              <label className="block text-xs text-muted">
                Notes
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={existing?.notes}
                  placeholder="What you shipped, and anything reviewers should know."
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-[#04110b]"
              >
                {existing ? "Update submission" : "Submit work"}
              </button>
              {existing ? (
                <p className="text-xs text-muted">
                  Current status: {submissionStatusLabel(existing.status)}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </aside>
    </main>
  );
}
