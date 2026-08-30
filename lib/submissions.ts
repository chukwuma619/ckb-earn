import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { listings, profiles, submissions } from "@/lib/db/schema";

export async function getUserSubmission(listingId: string, userId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(submissions)
    .where(
      and(eq(submissions.listingId, listingId), eq(submissions.userId, userId)),
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function listUserSubmissions(userId: string) {
  const db = getDb();
  return db
    .select({
      submission: submissions,
      listing: listings,
    })
    .from(submissions)
    .innerJoin(listings, eq(submissions.listingId, listings.id))
    .where(eq(submissions.userId, userId))
    .orderBy(desc(submissions.createdAt));
}

export async function listListingSubmissions(listingId: string) {
  const db = getDb();
  return db
    .select({
      submission: submissions,
      profile: profiles,
    })
    .from(submissions)
    .innerJoin(profiles, eq(submissions.userId, profiles.userId))
    .where(eq(submissions.listingId, listingId))
    .orderBy(desc(submissions.createdAt));
}

export async function listRecentSubmissions(limit = 20) {
  const db = getDb();
  return db
    .select({
      submission: submissions,
      listing: listings,
      profile: profiles,
    })
    .from(submissions)
    .innerJoin(listings, eq(submissions.listingId, listings.id))
    .innerJoin(profiles, eq(submissions.userId, profiles.userId))
    .orderBy(desc(submissions.createdAt))
    .limit(limit);
}
