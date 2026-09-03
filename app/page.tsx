import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { ListingFilters } from "@/components/listing-filters";
import { getCurrentProfile } from "@/lib/auth/session";
import { listingCategories, listingPriorities, listingTypes } from "@/lib/db/schema";
import type { ListingCategory, ListingPriority, ListingType } from "@/lib/db/schema";
import { countSubmissions, listPublicListings } from "@/lib/listings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ItemGroup } from "@/components/ui/item";

export const dynamic = "force-dynamic";

function asCategory(value?: string): ListingCategory | "all" | undefined {
  if (!value || value === "all") {
    return value === "all" ? "all" : undefined;
  }
  return (listingCategories as readonly string[]).includes(value)
    ? (value as ListingCategory)
    : undefined;
}

function asType(value?: string): ListingType | "all" | undefined {
  if (!value || value === "all") {
    return value === "all" ? "all" : undefined;
  }
  return (listingTypes as readonly string[]).includes(value)
    ? (value as ListingType)
    : undefined;
}

function asPriority(value?: string): ListingPriority | "all" | undefined {
  if (!value || value === "all") {
    return value === "all" ? "all" : undefined;
  }
  return (listingPriorities as readonly string[]).includes(value)
    ? (value as ListingPriority)
    : undefined;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; type?: string; priority?: string }>;
}) {
  const params = await searchParams;
  const { user } = await getCurrentProfile();
  const listings = await listPublicListings({
    category: asCategory(params.category),
    type: asType(params.type),
    priority: asPriority(params.priority),
    query: params.q,
  });
  const counts = await Promise.all(
    listings.map((listing) => countSubmissions(listing.id)),
  );

  return (
    <main className="mx-auto w-full max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Nervos Community Catalyst
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Community Keeps Building. Discover Bounties, Grants, and Spark mini-grants to build
            the future of CKB.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button variant="outline" size="lg" asChild>
            <Link href={user ? "/admin/bounties/new" : "/auth/sign-in"}>Become a Sponsor</Link>
          </Button>
          <Button size="lg" asChild>
            <Link href={user ? "/dashboard" : "/auth/sign-up"}>
              {user ? "Dashboard" : "Start Earning"}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:w-64">
          <Card className="sticky top-20">
            <CardContent>
              <ListingFilters
                category={params.category}
                type={params.type}
                priority={params.priority}
                query={params.q}
              />
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1">
          {listings.length === 0 ? (
            <Empty className="border border-dashed py-24">
              <EmptyHeader>
                <EmptyMedia variant="icon">0</EmptyMedia>
                <EmptyTitle>No listings found</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your filters or search query.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup>
              {listings.map((listing, index) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  submissions={counts[index]}
                />
              ))}
            </ItemGroup>
          )}
        </div>
      </div>
    </main>
  );
}
