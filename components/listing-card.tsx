import Link from "next/link";
import type { Listing } from "@/lib/db/schema";
import { formatDeadline, typeLabel } from "@/lib/format";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

function isOpen(listing: Listing) {
  if (listing.status !== "open") {
    return false;
  }
  if (!listing.deadline) {
    return true;
  }
  return listing.deadline.getTime() > Date.now();
}

function typeBadgeVariant(type: Listing["type"]) {
  switch (type) {
    case "spark":
      return "spark" as const;
    case "grant":
      return "outline" as const;
    case "bounty":
    case "permanent":
      return "secondary" as const;
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function ListingCard({
  listing,
  submissions,
}: {
  listing: Listing;
  submissions?: number;
}) {
  const featured =
    listing.priority === "urgent" ||
    (listing.priority === "high" && isOpen(listing));

  return (
    <Item
      variant="outline"
      className={cn(
        "lift transition-transform duration-150 ease-[var(--ease-out)]",
        featured && "border-reactor/30 bg-reactor-wash/40 dark:bg-reactor/10",
      )}
    >
      <ItemMedia>
        <div className="flex size-12 items-center justify-center rounded-[4px] border border-slate/10 bg-stone-2 dark:border-void-line dark:bg-void-mid">
          <Logo className="size-5" />
        </div>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="font-display font-bold tracking-tight">
          <Link href={`/bounties/${listing.slug}`}>{listing.title}</Link>
        </ItemTitle>
        <ItemDescription className="flex flex-wrap items-center gap-2">
          <Badge variant={typeBadgeVariant(listing.type)}>
            {typeLabel(listing.type)}
          </Badge>
          {featured ? (
            <Badge
              variant={
                listing.priority === "urgent" ? "destructive" : "default"
              }
            >
              {listing.priority === "urgent" ? "Urgent" : "High"}
            </Badge>
          ) : null}
          {listing.forumThreadUrl ? (
            <Badge variant="outline" asChild>
              <a href={listing.forumThreadUrl} target="_blank" rel="noreferrer">
                Forum
              </a>
            </Badge>
          ) : null}
          {typeof submissions === "number" && submissions > 0 ? (
            <span className="font-mono text-[0.7rem] uppercase tracking-wide">
              {submissions} submissions
            </span>
          ) : null}
          <span className="font-mono text-[0.7rem] uppercase tracking-wide">
            {formatDeadline(listing.deadline)}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex-col items-end">
        <span className="font-mono text-lg font-semibold tabular-nums tracking-tight">
          ${listing.rewardUsd.toLocaleString()}
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
          USD
        </span>
      </ItemActions>
    </Item>
  );
}
