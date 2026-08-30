import Link from "next/link";
import type { Listing } from "@/lib/db/schema";
import { formatDeadline, typeLabel } from "@/lib/format";

function isOpen(listing: Listing) {
  if (listing.status !== "open") {
    return false;
  }
  if (!listing.deadline) {
    return true;
  }
  return listing.deadline.getTime() > Date.now();
}

export function ListingCard({
  listing,
  submissions,
}: {
  listing: Listing;
  submissions?: number;
}) {
  const featured = listing.priority === "urgent" || (listing.priority === "high" && isOpen(listing));

  return (
    <div
      className={`relative block w-full rounded-md px-2 py-4 no-underline hover:bg-gray-100 sm:px-4 ${
        featured ? "bg-featured-bg" : ""
      }`}
    >
      <Link href={`/bounties/${listing.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">View {listing.title}</span>
      </Link>
      <div className="relative z-10 flex w-full items-center justify-between pointer-events-none">
        <div className="flex w-full min-w-0">
          <div className="mr-3 grid h-14 w-14 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500 sm:mr-5 sm:h-16 sm:w-16">
            CR
          </div>
          <div className="flex min-w-0 flex-col justify-between">
            <p className="line-clamp-1 text-sm font-semibold text-slate-700 sm:text-base">
              {listing.title}
            </p>
            <p className="text-xs whitespace-nowrap text-slate-500 md:text-sm">
              CKB Rewards
            </p>
            <div className="mt-px flex flex-wrap items-center gap-1 sm:gap-2">
              <p className="hidden text-xs font-medium text-gray-500 sm:flex">
                {typeLabel(listing.type)}
              </p>
              <p className="hidden text-slate-300 sm:flex sm:text-xs">|</p>
              <p className="text-[10px] whitespace-nowrap text-gray-500 sm:text-xs">
                {formatDeadline(listing.deadline)}
              </p>
              {typeof submissions === "number" && submissions > 0 ? (
                <>
                  <p className="hidden text-slate-300 sm:flex sm:text-xs">|</p>
                  <p className="hidden text-xs text-gray-500 sm:flex">
                    {submissions}
                  </p>
                </>
              ) : null}
              {featured ? (
                <p className={`hidden text-xs font-semibold sm:flex ${listing.priority === 'urgent' ? 'text-red-500' : 'text-featured'}`}>
                  {listing.priority === 'urgent' ? 'URGENT' : 'FEATURED'}
                </p>
              ) : null}
              {listing.forumThreadUrl ? (
                <>
                  <p className="hidden text-slate-300 sm:flex sm:text-xs">|</p>
                  <a
                    href={listing.forumThreadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden text-xs text-blue-500 hover:underline sm:flex pointer-events-auto"
                  >
                    Forum Link
                  </a>
                </>
              ) : null}
              {isOpen(listing) ? (
                <span className="mx-1 h-2 w-2 rounded-full bg-accent sm:mx-0" />
              ) : null}
            </div>
          </div>
        </div>
        <div className="ml-3 hidden shrink-0 items-baseline gap-1 sm:flex">
          <span className="text-xs font-semibold whitespace-nowrap text-slate-600 sm:text-base">
            {listing.rewardUsd.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-gray-400 sm:text-base">
            USD
          </span>
        </div>
      </div>
    </div>
  );
}
