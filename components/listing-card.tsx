import Link from "next/link";
import type { Listing } from "@/lib/types";
import { categoryLabel, formatDeadline, typeLabel } from "@/lib/format";
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

function typeBadgeVariant(type: Listing["type"]) {
  switch (type) {
    case "grant":
      return "outline" as const;
    case "bounty":
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
  return (
    <Item variant="outline" className="lift transition-transform duration-150 ease-[var(--ease-out)]">
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
          <Badge variant="outline">{categoryLabel(listing.category)}</Badge>
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
          ${listing.rewardAmount.toLocaleString()}
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
          USD
        </span>
      </ItemActions>
    </Item>
  );
}
