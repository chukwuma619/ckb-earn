import { ListingCard } from "@/components/listing-card";
import { ListingFilters } from "@/components/listing-filters";
import { countSubmissions, listPublicListings } from "@/lib/listings";
import type { ListingCategory, ListingType } from "@/lib/db/schema";
import { listingCategories, listingTypes } from "@/lib/db/schema";

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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; type?: string }>;
}) {
  const params = await searchParams;
  const category = asCategory(params.category);
  const type = asType(params.type);
  const listings = await listPublicListings({
    category,
    type,
    query: params.q,
  });

  const counts = await Promise.all(
    listings.map((listing) => countSubmissions(listing.id)),
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="mb-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Community Keeps Building
          </p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Find your next CKB bounty.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            Write, design, refer projects, and ship for Nervos. One profile.
            Paid in CKB. No more hunting through Notion.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-medium">Become a sponsor</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Post a bounty or project and reach CKB builders, writers, and
            designers from one dashboard.
          </p>
          <a
            href="/admin/bounties/new"
            className="mt-4 inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
          >
            Post a listing
          </a>
        </div>
      </section>

      <ListingFilters
        category={params.category}
        type={params.type}
        query={params.q}
      />

      <section className="mt-8 grid gap-4">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-muted">
            No open listings match those filters yet.
          </div>
        ) : (
          listings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              submissions={counts[index]}
            />
          ))
        )}
      </section>
    </main>
  );
}
