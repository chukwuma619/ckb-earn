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
    <main className="mx-auto w-full max-w-[70rem] px-3 py-4 sm:px-4">
      <section className="grid gap-3 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="relative overflow-hidden rounded-lg bg-black px-5 py-6 text-white md:px-10 md:py-10 border border-slate-200">
          <h1 className="relative z-10 text-2xl leading-[120%] font-bold md:text-[28px]">
            Nervos Community Catalyst
          </h1>
          <p className="relative z-10 mt-2.5 max-w-[30rem] text-sm leading-[130%] text-white/90 md:mt-4 md:text-lg">
            Community Keeps Building. Discover Bounties, Grants, and Spark mini-grants to build the future of CKB.
          </p>
          <div className="relative z-10 mt-6">
            <Link
              href={user ? "/dashboard" : "/auth/sign-up"}
              className="btn inline-flex rounded-md bg-[#14E082] px-9 py-3 text-sm font-bold text-black hover:bg-[#00CC9B]"
            >
              {user ? "Dashboard" : "Sign Up"}
            </Link>
          </div>
        </div>
        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-800">
            Become a Sponsor
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Reach CKB talent in a few clicks. Get writing, design, and
            development done for the ecosystem.
          </p>
          <Link
            href={user ? "/admin/bounties/new" : "/auth/sign-in"}
            className="btn mt-4 inline-flex rounded-md bg-brand px-4 py-2 text-sm font-medium text-white"
          >
            Get Started
          </Link>
        </aside>
      </section>

      <section className="mt-8">
        <ListingFilters
          category={params.category}
          type={params.type}
          priority={params.priority}
          query={params.q}
        />
        <div className="mt-2">
          {listings.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">
              No listings found
            </p>
          ) : (
            listings.map((listing, index) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                submissions={counts[index]}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
