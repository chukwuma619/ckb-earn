import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { listUserSubmissions } from "@/lib/submissions";
import { formatUsd, submissionStatusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user } = await getCurrentProfile();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const rows = await listUserSubmissions(user.id);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Your work</h1>
      <p className="mt-2 text-sm text-muted">
        Submissions, wins, and payout status.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-muted">
            No submissions yet.{" "}
            <Link href="/" className="text-accent">
              Browse open bounties
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Listing</th>
                <th className="px-4 py-3 font-medium">Reward</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ submission, listing }) => (
                <tr key={submission.id} className="border-t border-border">
                  <td className="px-4 py-4">
                    <Link
                      href={`/bounties/${listing.slug}`}
                      className="font-medium hover:text-accent"
                    >
                      {listing.title}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-gold">{listing.rewardLabel}</td>
                  <td className="px-4 py-4 text-muted">
                    {submissionStatusLabel(submission.status)}
                  </td>
                  <td className="px-4 py-4 text-muted">
                    {submission.createdAt.toLocaleDateString()}
                    <span className="sr-only">{formatUsd(listing.rewardUsd)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
