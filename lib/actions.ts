"use server";

import { revalidatePath } from "next/cache";
import {
  clearDemoSession,
  requireAdmin,
  requireUser,
} from "@/lib/auth/session";
import { getStore, newId } from "@/lib/data/store";
import { slugify } from "@/lib/listings";
import {
  listingCategories,
  listingStatuses,
  listingTypes,
  submissionStatuses,
  type ListingCategory,
  type ListingStatus,
  type ListingType,
  type SubmissionStatus,
} from "@/lib/types";

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

function isSubmissionStatus(value: string): value is SubmissionStatus {
  return (submissionStatuses as readonly string[]).includes(value);
}

export async function updateProfileAction(formData: FormData) {
  const { user } = await requireUser();
  const store = getStore();
  const profile = store.profiles.find((row) => row.userId === user.id);
  if (!profile) {
    throw new Error("Profile not found.");
  }

  profile.name = readString(formData, "name") || user.name;
  profile.bio = readString(formData, "bio");
  profile.ckbAddress = readString(formData, "ckbAddress");
  profile.twitter = readString(formData, "twitter");
  profile.skills = readString(formData, "skills");
  profile.updatedAt = new Date();

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

  const store = getStore();
  const listing = store.listings.find((row) => row.id === listingId);
  if (!listing || listing.status !== "open") {
    throw new Error("This listing is not accepting submissions.");
  }

  const existing = store.submissions.find(
    (submission) =>
      submission.listingId === listingId && submission.userId === user.id,
  );

  if (existing) {
    existing.link = link;
    existing.notes = notes;
  } else {
    store.submissions.push({
      id: newId("submission"),
      listingId,
      userId: user.id,
      link,
      forumPostUrl: null,
      milestoneNumber: null,
      notes,
      status: "pending",
      createdAt: new Date(),
      reviewedAt: null,
    });
  }

  revalidatePath(`/bounties/${listing.slug}`);
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}

export async function upsertListingAction(formData: FormData) {
  const { user } = await requireAdmin();
  const store = getStore();

  const id = readString(formData, "id");
  const title = readString(formData, "title");
  const description = readString(formData, "description");
  const requirements = readString(formData, "requirements");
  const category = readString(formData, "category");
  const type = readString(formData, "type");
  const status = readString(formData, "status") || "open";
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

  if (!isStatus(status)) {
    throw new Error("Invalid listing status.");
  }

  const values = {
    title,
    description,
    requirements,
    category,
    type,
    status,
    rewardUsd: Number.isFinite(rewardUsd) ? rewardUsd : 0,
    rewardLabel: rewardLabel || `$${rewardUsd} in CKB`,
    winnerCount: Number.isFinite(winnerCount) ? winnerCount : 1,
    deadline: deadlineValue ? new Date(deadlineValue) : null,
    tags,
    createdBy: user.id,
    updatedAt: new Date(),
  };

  if (id) {
    const listing = store.listings.find((row) => row.id === id);
    if (!listing) {
      throw new Error("Listing not found.");
    }
    Object.assign(listing, values);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/bounties/${listing.slug}`);
    revalidatePath(`/admin/bounties/${listing.id}`);
    return;
  }

  const baseSlug = slugify(title) || "listing";
  let slug = baseSlug;
  let attempt = 1;
  while (store.listings.some((listing) => listing.slug === slug)) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const created = {
    id: newId("listing"),
    slug,
    forumThreadUrl: null as string | null,
    isMilestoneBased: false,
    createdAt: new Date(),
    ...values,
  };
  store.listings.push(created);

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

  const store = getStore();
  const current = store.submissions.find(
    (submission) => submission.id === submissionId,
  );
  if (!current) {
    throw new Error("Submission not found.");
  }

  current.status = status;
  current.reviewedAt = new Date();

  const listing = store.listings.find((row) => row.id === current.listingId);
  if (listing && (status === "winner" || status === "paid")) {
    listing.status = status === "paid" ? "awarded" : "reviewing";
    listing.updatedAt = new Date();
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  if (listing) {
    revalidatePath(`/bounties/${listing.slug}`);
    revalidatePath(`/admin/bounties/${listing.id}`);
  }
}

export async function signOutAction() {
  await clearDemoSession();
  revalidatePath("/");
}
