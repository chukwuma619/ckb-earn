import Link from "next/link";
import type { Listing } from "@/lib/db/schema";
import { formatDeadline, typeLabel } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

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
    <Item variant="outline" className={featured ? "bg-muted/50" : undefined}>
      <ItemMedia>
        <Avatar className="size-12 rounded-lg after:rounded-lg">
          <AvatarFallback className="rounded-lg text-xs font-bold">CKB</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <Link href={`/bounties/${listing.slug}`}>{listing.title}</Link>
        </ItemTitle>
        <ItemDescription className="flex flex-wrap items-center gap-2">
          <span>{typeLabel(listing.type)}</span>
          {featured ? (
            <Badge variant={listing.priority === "urgent" ? "destructive" : "secondary"}>
              {listing.priority === "urgent" ? "Urgent" : "High"}
            </Badge>
          ) : null}
          {listing.forumThreadUrl ? (
            <Badge variant="outline" asChild>
              <a href={listing.forumThreadUrl} target="_blank" rel="noreferrer">
                Forum Link
              </a>
            </Badge>
          ) : null}
          {typeof submissions === "number" && submissions > 0 ? (
            <span>{submissions} Submissions</span>
          ) : null}
          <span>{formatDeadline(listing.deadline)}</span>
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex-col items-end">
        <span className="text-lg font-semibold">{listing.rewardUsd.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground">USD</span>
      </ItemActions>
    </Item>
  );
}
