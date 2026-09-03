"use server";

import { revalidatePath } from "next/cache";
import {
  clearDemoSession,
  requireAdmin,
  requireUser,
} from "@/lib/auth/session";
import { getStore, newId } from "@/lib/data/store";
import {
  collectSubmissionAnswers,
  parseFormFieldsJson,
} from "@/lib/forms";
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

  if (!listingId) {
    throw new Error("A listing is required.");
  }

  const store = getStore();
  const listing = store.listings.find((row) => row.id === listingId);
  if (!listing || listing.status !== "open") {
    throw new Error("This listing is not accepting submissions.");
  }

  const answers = collectSubmissionAnswers(formData, listing.formFields);

  const existing = store.submissions.find(
    (submission) =>
      submission.listingId === listingId && submission.userId === user.id,
  );

  if (existing) {
    existing.answers = answers;
  } else {
    store.submissions.push({
      id: newId("submission"),
      listingId,
      userId: user.id,
      answers,
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
  const details = readString(formData, "details");
  const category = readString(formData, "category");
  const type = readString(formData, "type");
  const status = readString(formData, "status") || "open";
  const rewardAmount = Number(readString(formData, "rewardAmount") || "0");
  const deadlineValue = readString(formData, "deadline");
  const formFields = parseFormFieldsJson(readString(formData, "formFields"));

  if (!title || !details || !isCategory(category) || !isType(type)) {
    throw new Error("Title, details, category, and type are required.");
  }

  if (!isStatus(status)) {
    throw new Error("Invalid listing status.");
  }

  const values = {
    title,
    details,
    category,
    type,
    status,
    rewardAmount: Number.isFinite(rewardAmount) ? rewardAmount : 0,
    deadline: deadlineValue ? new Date(deadlineValue) : null,
    formFields,
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
  if (listing && status === "paid") {
    listing.status = "closed";
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
