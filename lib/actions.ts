"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { requireAdmin, requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import {
  listingCategories,
  listingPriorities,
  listingStatuses,
  listingTypes,
  listings,
  profiles,
  submissionStatuses,
  submissions,
  type ListingCategory,
  type ListingPriority,
  type ListingStatus,
  type ListingType,
  type SubmissionStatus,
} from "@/lib/db/schema";
import { slugify } from "@/lib/listings";

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function isCategory(value: string): value is ListingCategory {
  return (listingCategories as readonly string[]).includes(value);
}

function isType(value: string): value is ListingType {
  return (listingTypes as readonly string[]).includes(value);
}

function isStatus(value: string): value is ListingStatus {
  return (listingStatuses as readonly string[]).includes(value);
}

function isPriority(value: string): value is ListingPriority {
  return (listingPriorities as readonly string[]).includes(value);
}

function isSubmissionStatus(value: string): value is SubmissionStatus {
  return (submissionStatuses as readonly string[]).includes(value);
}

export async function updateProfileAction(formData: FormData) {
  const { user } = await requireUser();
  const db = getDb();

  await db
    .update(profiles)
    .set({
      name: readString(formData, "name") || user.name,
      bio: readString(formData, "bio"),
      ckbAddress: readString(formData, "ckbAddress"),
      twitter: readString(formData, "twitter"),
      skills: readString(formData, "skills"),
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, user.id));

  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

export async function submitToListingAction(formData: FormData) {
  const { user } = await requireUser();
  const listingId = readString(formData, "listingId");
  const link = readString(formData, "link");
  const notes = readString(formData, "notes");

  if (!listingId || !link) {
    throw new Error("A listing and a submission link are required.");
  }

  const db = getDb();
  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, listingId))
    .limit(1);

  if (!listing || listing.status !== "open") {
    throw new Error("This listing is not accepting submissions.");
  }

  await db
    .insert(submissions)
    .values({
      listingId,
      userId: user.id,
      link,
      notes,
    })
    .onConflictDoUpdate({
      target: [submissions.listingId, submissions.userId],
      set: {
        link,
        notes,
      },
    });

  revalidatePath(`/bounties/${listing.slug}`);
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}

export async function upsertListingAction(formData: FormData) {
  const { user } = await requireAdmin();
  const db = getDb();

  const id = readString(formData, "id");
  const title = readString(formData, "title");
  const description = readString(formData, "description");
  const requirements = readString(formData, "requirements");
  const category = readString(formData, "category");
  const type = readString(formData, "type");
  const status = readString(formData, "status") || "open";
  const priority = readString(formData, "priority") || "medium";
  const rewardUsd = Number(readString(formData, "rewardUsd") || "0");
  const rewardLabel = readString(formData, "rewardLabel");
  const winnerCount = Number(readString(formData, "winnerCount") || "1");
  const deadlineValue = readString(formData, "deadline");
  const tags = readString(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!title || !description || !isCategory(category) || !isType(type)) {
    throw new Error("Title, description, category, and type are required.");
  }

  if (!isStatus(status) || !isPriority(priority)) {
    throw new Error("Invalid listing status or priority.");
  }

  const values = {
    title,
    description,
    requirements,
    category,
    type,
    status,
    priority,
    rewardUsd: Number.isFinite(rewardUsd) ? rewardUsd : 0,
    rewardLabel: rewardLabel || `$${rewardUsd} in CKB`,
    winnerCount: Number.isFinite(winnerCount) ? winnerCount : 1,
    deadline: deadlineValue ? new Date(deadlineValue) : null,
    tags,
    createdBy: user.id,
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(listings).set(values).where(eq(listings.id, id));
    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, id))
      .limit(1);
    revalidatePath("/");
    revalidatePath("/admin");
    if (listing) {
      revalidatePath(`/bounties/${listing.slug}`);
      revalidatePath(`/admin/bounties/${listing.id}`);
    }
    return;
  }

  const baseSlug = slugify(title) || "listing";
  let slug = baseSlug;
  let attempt = 1;
  while (true) {
    const existing = await db
      .select({ id: listings.id })
      .from(listings)
      .where(eq(listings.slug, slug))
      .limit(1);
    if (!existing[0]) {
      break;
    }
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const [created] = await db
    .insert(listings)
    .values({ ...values, slug })
    .returning();

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/bounties/${created.slug}`);
}

export async function updateSubmissionStatusAction(formData: FormData) {
  await requireAdmin();
  const submissionId = readString(formData, "submissionId");
  const status = readString(formData, "status");

  if (!submissionId || !isSubmissionStatus(status)) {
    throw new Error("A valid submission and status are required.");
  }

  const db = getDb();
  const [current] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);

  if (!current) {
    throw new Error("Submission not found.");
  }

  await db
    .update(submissions)
    .set({
      status,
      reviewedAt: new Date(),
    })
    .where(eq(submissions.id, submissionId));

  if (status === "winner" || status === "paid") {
    await db
      .update(listings)
      .set({
        status: status === "paid" ? "awarded" : "reviewing",
        updatedAt: new Date(),
      })
      .where(eq(listings.id, current.listingId));
  }

  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, current.listingId))
    .limit(1);

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  if (listing) {
    revalidatePath(`/bounties/${listing.slug}`);
    revalidatePath(`/admin/bounties/${listing.id}`);
  }
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
}
