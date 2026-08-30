import { notFound, redirect } from "next/navigation";
import { getCurrentProfile, isAdminEmail } from "@/lib/auth/session";
import { getListingById } from "@/lib/listings";
import { listListingSubmissions } from "@/lib/submissions";
import { ListingForm } from "@/components/listing-form";
import { updateSubmissionStatusAction } from "@/lib/actions";
import { submissionStatusLabel } from "@/lib/format";
import { submissionStatuses } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, profile } = await getCurrentProfile();
  if (!user) {
    redirect("/auth/sign-in");
  }
  if (!profile?.isAdmin && !isAdminEmail(user.email)) {
    redirect("/");
  }

  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) {
    notFound();
  }

  const submissions = await listListingSubmissions(listing.id);

  return (
    <main className="mx-auto grid w-full max-w-[70rem] gap-10 px-3 py-6 sm:px-4 lg:grid-cols-2">
      <section>
        <h1 className="text-xl font-semibold text-slate-800">Edit listing</h1>
        <div className="mt-6">
          <ListingForm listing={listing} />
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-800">Submissions</h2>
        <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
          {submissions.length === 0 ? (
            <p className="py-10 text-sm text-slate-500">No submissions yet.</p>
          ) : (
            submissions.map(({ submission, profile: talent }) => (
              <div key={submission.id} className="py-4">
                <p className="text-sm font-semibold text-slate-700">
                  {talent.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">{talent.email}</p>
                <a
                  href={submission.link}
                  className="mt-2 inline-block text-sm text-slate-800 underline"
                >
                  {submission.link}
                </a>
                {submission.notes ? (
                  <p className="mt-2 text-sm text-slate-500">
                    {submission.notes}
                  </p>
                ) : null}
                <form
                  action={updateSubmissionStatusAction}
                  className="mt-3 flex items-center gap-2"
                >
                  <input type="hidden" name="submissionId" value={submission.id} />
                  <select
                    name="status"
                    defaultValue={submission.status}
                    className="rounded-md border border-slate-200 px-2 py-1 text-sm"
                  >
                    {submissionStatuses.map((status) => (
                      <option key={status} value={status}>
                        {submissionStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-md border border-slate-200 px-2 py-1 text-sm"
                  >
                    Update
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
