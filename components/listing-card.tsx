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
      className={`group relative flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/50 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
        featured ? "bg-featured-bg ring-1 ring-accent/30" : ""
      }`}
    >
      <Link href={`/bounties/${listing.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">View {listing.title}</span>
      </Link>
      
      <div className="relative z-10 flex flex-1 items-start gap-4 pointer-events-none">
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background text-sm font-bold text-muted ring-1 ring-inset ring-border sm:flex">
          CKB
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-accent sm:text-lg">
            {listing.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted">
              {typeLabel(listing.type)}
            </span>

            {featured && (
              <>
                <span className="hidden text-border sm:inline">•</span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                    listing.priority === "urgent"
                      ? "bg-danger/10 text-danger"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  {listing.priority === "urgent" ? "Urgent" : "High"}
                </span>
              </>
            )}

            {listing.forumThreadUrl && (
              <>
                <span className="hidden text-border sm:inline">•</span>
                <a
                  href={listing.forumThreadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto rounded-md bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-500 ring-1 ring-inset ring-border transition-colors hover:bg-surface-hover hover:text-blue-600"
                >
                  Forum Link
                </a>
              </>
            )}

            {typeof submissions === "number" && submissions > 0 && (
              <>
                <span className="hidden text-border sm:inline">•</span>
                <span className="text-xs font-medium text-muted">
                  {submissions} Submissions
                </span>
              </>
            )}

            <span className="hidden text-border sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              {isOpen(listing) && (
                <span className="h-2 w-2 rounded-full bg-accent" />
              )}
              <span className="text-xs font-medium text-muted">
                {formatDeadline(listing.deadline)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex shrink-0 items-baseline gap-1 pl-12 pointer-events-none sm:flex-col sm:items-end sm:justify-center sm:pl-0">
        <span className="text-lg font-extrabold text-foreground sm:text-xl">
          {listing.rewardUsd.toLocaleString()}
        </span>
        <span className="text-xs font-semibold text-muted">USD</span>
      </div>
    </div>
  );
}
