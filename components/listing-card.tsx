import Link from "next/link";
import type { Listing } from "@/lib/db/schema";
import {
  categoryLabel,
  formatDeadline,
  formatUsd,
  typeLabel,
} from "@/lib/format";

export function ListingCard({
  listing,
  submissions,
}: {
  listing: Listing;
  submissions?: number;
}) {
  return (
    <Link
      href={`/bounties/${listing.slug}`}
      className="group block rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/40 hover:bg-surface-2"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted">
            <span className="rounded-full bg-accent-dim px-2 py-0.5 text-accent">
              {typeLabel(listing.type)}
            </span>
            <span>{categoryLabel(listing.category)}</span>
            {listing.priority === "high" ? (
              <span className="text-gold">High priority</span>
            ) : null}
          </div>
          <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-accent">
            {listing.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {listing.description}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-semibold text-gold">
            {listing.rewardLabel}
          </div>
          <div className="text-xs text-muted">{formatUsd(listing.rewardUsd)}</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
        <span>{formatDeadline(listing.deadline)}</span>
        {typeof submissions === "number" ? (
          <span>
            {submissions} submission{submissions === 1 ? "" : "s"}
          </span>
        ) : null}
        {listing.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-border px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
