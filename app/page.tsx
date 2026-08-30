import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { ListingFilters } from "@/components/listing-filters";
import { getCurrentProfile } from "@/lib/auth/session";
import { listingCategories, listingTypes, listingPriorities } from "@/lib/db/schema";
import type { ListingCategory, ListingType, ListingPriority } from "@/lib/db/schema";
import { countSubmissions, listPublicListings } from "@/lib/listings";

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
      {/* Sleek Minimalist Hero */}
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Nervos Community <span className="text-accent">Catalyst</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Community Keeps Building. Discover Bounties, Grants, and Spark mini-grants to build the future of CKB.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            href={user ? "/admin/bounties/new" : "/auth/sign-in"}
            className="btn inline-flex items-center justify-center rounded-lg bg-surface px-6 py-3 text-sm font-semibold text-foreground ring-1 ring-inset ring-border hover:bg-surface-hover"
          >
            Become a Sponsor
          </Link>
          <Link
            href={user ? "/dashboard" : "/auth/sign-up"}
            className="btn inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black hover:opacity-90"
          >
            {user ? "Dashboard" : "Start Earning"}
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        {/* Left Sidebar for Filters */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="sticky top-20 rounded-xl border border-border bg-surface p-5">
            <ListingFilters
              category={params.category}
              type={params.type}
              priority={params.priority}
              query={params.q}
            />
          </div>
        </aside>

        {/* Right Side List of Cards */}
        <div className="flex-1">
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-24 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-background text-lg font-bold text-muted ring-1 ring-border">
                0
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">No listings found</h3>
              <p className="mt-2 text-sm text-muted">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {listings.map((listing, index) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  submissions={counts[index]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
