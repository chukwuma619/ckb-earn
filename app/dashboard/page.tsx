import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { listUserSubmissions } from "@/lib/submissions";
import { submissionStatusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user } = await getCurrentProfile();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const rows = await listUserSubmissions(user.id);

  return (
    <main className="mx-auto w-full max-w-[70rem] px-3 py-6 sm:px-4">
      <h1 className="text-xl font-semibold text-slate-800">Your Submissions</h1>
      <p className="mt-1 text-sm text-slate-500">
        Track status and payouts from one place.
      </p>
      <div className="mt-6">
        {rows.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">
            No submissions yet.{" "}
            <Link href="/" className="font-medium text-slate-800">
              Browse listings
            </Link>
          </p>
        ) : (
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {rows.map(({ submission, listing }) => (
              <Link
                key={submission.id}
                href={`/bounties/${listing.slug}`}
                className="flex items-center justify-between gap-4 py-4 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {listing.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {submissionStatusLabel(submission.status)} ·{" "}
                    {submission.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  {listing.rewardUsd.toLocaleString()}{" "}
                  <span className="font-medium text-gray-400">USD</span>
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
