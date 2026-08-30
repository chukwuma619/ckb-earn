import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  listings,
  submissions,
  type ListingCategory,
  type ListingPriority,
  type ListingStatus,
  type ListingType,
} from "@/lib/db/schema";

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
  priority?: ListingPriority | "all";
  query?: string;
}) {
  const db = getDb();
  const conditions = [eq(listings.status, "open")];

  if (filters.category && filters.category !== "all") {
    conditions.push(eq(listings.category, filters.category));
  }

  if (filters.type && filters.type !== "all") {
    conditions.push(eq(listings.type, filters.type));
  }

  if (filters.priority && filters.priority !== "all") {
    conditions.push(eq(listings.priority, filters.priority));
  }

  if (filters.query?.trim()) {
    const needle = `%${filters.query.trim()}%`;
    conditions.push(
      or(ilike(listings.title, needle), ilike(listings.description, needle))!,
    );
  }

  return db
    .select()
    .from(listings)
    .where(and(...conditions))
    .orderBy(desc(listings.createdAt));
}

export async function getListingBySlug(slug: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(listings)
    .where(eq(listings.slug, slug))
    .limit(1);

  return rows[0] ?? null;
}

export async function getListingById(id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(listings)
    .where(eq(listings.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function listAdminListings(status?: ListingStatus | "all") {
  const db = getDb();
  if (!status || status === "all") {
    return db.select().from(listings).orderBy(desc(listings.createdAt));
  }

  return db
    .select()
    .from(listings)
    .where(eq(listings.status, status))
    .orderBy(desc(listings.createdAt));
}

export async function countSubmissions(listingId: string) {
  const db = getDb();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(submissions)
    .where(eq(submissions.listingId, listingId));

  return row?.count ?? 0;
}
