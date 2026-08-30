import Link from "next/link";
import { notFound } from "next/navigation";
import { submitToListingAction } from "@/lib/actions";
import { getCurrentProfile } from "@/lib/auth/session";
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
    <main className="mx-auto grid w-full max-w-[70rem] gap-8 px-3 py-6 sm:px-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <article>
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-md bg-slate-100 text-sm font-semibold text-slate-500">
            CR
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800 md:text-2xl">
              {listing.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              CKB Rewards · {typeLabel(listing.type)} ·{" "}
              {categoryLabel(listing.category)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {statusLabel(listing.status)} · {formatDeadline(listing.deadline)}{" "}
              · {submissions} submission{submissions === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <div className="mt-8 whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {listing.description}
        </div>
        {listing.requirements ? (
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-slate-800">
              Skills Needed
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-500">
              {listing.requirements}
            </p>
          </section>
        ) : null}
      </article>

      <aside className="space-y-4">
        <div className="rounded-md border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Prize</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">
            {listing.rewardUsd.toLocaleString()}{" "}
            <span className="text-base font-medium text-gray-400">USD</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">{listing.rewardLabel}</p>
          <p className="mt-3 text-xs text-slate-400">
            {listing.winnerCount} winner{listing.winnerCount === 1 ? "" : "s"} ·{" "}
            {formatUsd(listing.rewardUsd)}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800">Submit</h2>
          {!user ? (
            <p className="mt-3 text-sm leading-6 text-slate-500">
              <Link href="/auth/sign-in" className="font-medium text-slate-800">
                Login
              </Link>{" "}
              to submit. Add your CKB address on your profile before payout.
            </p>
          ) : !open ? (
            <p className="mt-3 text-sm text-slate-500">
              This listing is no longer accepting submissions.
            </p>
          ) : (
            <form action={submitToListingAction} className="mt-4 space-y-3">
              <input type="hidden" name="listingId" value={listing.id} />
              <label className="block text-xs text-slate-500">
                Work link
                <input
                  name="link"
                  required
                  defaultValue={existing?.link}
                  placeholder="https://"
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label className="block text-xs text-slate-500">
                Notes
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={existing?.notes}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <button
                type="submit"
                className="btn w-full rounded-md bg-brand py-2 text-sm font-medium text-white"
              >
                {existing ? "Update submission" : "Submit"}
              </button>
              {existing ? (
                <p className="text-xs text-slate-400">
                  {submissionStatusLabel(existing.status)}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </aside>
    </main>
  );
}
