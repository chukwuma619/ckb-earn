import { getStore } from "@/lib/data/store";
import type {
  ListingCategory,
  ListingStatus,
  ListingType,
} from "@/lib/types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
}

export async function listPublicListings(filters: {
  category?: ListingCategory | "all";
  type?: ListingType | "all";
  query?: string;
}) {
  const store = getStore();
  const needle = filters.query?.trim().toLowerCase();

  return store.listings
    .filter((listing) => listing.status === "open")
    .filter((listing) =>
      !filters.category || filters.category === "all"
        ? true
        : listing.category === filters.category,
    )
    .filter((listing) =>
      !filters.type || filters.type === "all"
        ? true
        : listing.type === filters.type,
    )
    .filter((listing) =>
      !needle
        ? true
        : listing.title.toLowerCase().includes(needle) ||
          listing.description.toLowerCase().includes(needle),
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getListingBySlug(slug: string) {
  return getStore().listings.find((listing) => listing.slug === slug) ?? null;
}

export async function getListingById(id: string) {
  return getStore().listings.find((listing) => listing.id === id) ?? null;
}

export async function listAdminListings(status?: ListingStatus | "all") {
  const rows = getStore().listings;
  const filtered =
    !status || status === "all"
      ? rows
      : rows.filter((listing) => listing.status === status);

  return [...filtered].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export async function countSubmissions(listingId: string) {
  return getStore().submissions.filter(
    (submission) => submission.listingId === listingId,
  ).length;
}
