import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile, isAdminEmail } from "@/lib/auth/session";
import { listAdminListings } from "@/lib/listings";
import { statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user) {
    redirect("/auth/sign-in");
  }
  if (!profile?.isAdmin && !isAdminEmail(user.email)) {
    redirect("/");
  }

  const rows = await listAdminListings();

  return (
    <main className="mx-auto w-full max-w-[70rem] px-3 py-6 sm:px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Listings</h1>
        <Link
          href="/admin/bounties/new"
          className="btn rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white"
        >
          New listing
        </Link>
      </div>
      <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
        {rows.map((listing) => (
          <Link
            key={listing.id}
            href={`/admin/bounties/${listing.id}`}
            className="flex items-center justify-between py-4 hover:bg-gray-50"
          >
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {listing.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {statusLabel(listing.status)}
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {listing.rewardUsd.toLocaleString()}{" "}
              <span className="font-medium text-gray-400">USD</span>
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
