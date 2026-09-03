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
import { parsePrizeSlotsJson } from "@/lib/prizes";
import { isListingEnded, slugify } from "@/lib/listings";
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
  if (!listing || listing.status !== "open" || isListingEnded(listing)) {
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
  const deadlineValue = readString(formData, "deadline");
  const prizeSlots = parsePrizeSlotsJson(readString(formData, "prizeSlots"));
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
    prizeSlots,
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

  const listing = store.listings.find((row) => row.id === current.listingId);
  if (!listing) {
    throw new Error("Listing not found.");
  }

  current.status = status;
  current.reviewedAt = new Date();

  if (status === "rejected") {
    store.awards = store.awards.filter(
      (award) => award.submissionId !== current.id,
    );
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath(`/bounties/${listing.slug}`);
  revalidatePath(`/admin/bounties/${listing.id}`);
}

export async function endListingAction(formData: FormData) {
  await requireAdmin();
  const listingId = readString(formData, "listingId");
  const store = getStore();
  const listing = store.listings.find((row) => row.id === listingId);
  if (!listing) {
    throw new Error("Listing not found.");
  }

  listing.status = "closed";
  listing.updatedAt = new Date();

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/bounties/${listing.slug}`);
  revalidatePath(`/admin/bounties/${listing.id}`);
}

export async function settlePrizesAction(formData: FormData) {
  await requireAdmin();
  const listingId = readString(formData, "listingId");
  const store = getStore();
  const listing = store.listings.find((row) => row.id === listingId);
  if (!listing) {
    throw new Error("Listing not found.");
  }

  listing.status = "closed";
  listing.updatedAt = new Date();

  const listingSubmissions = store.submissions.filter(
    (submission) => submission.listingId === listingId,
  );
  const assignments = new Map<string, string>();

  for (const slot of listing.prizeSlots) {
    const submissionId = readString(formData, `prize_${slot.id}`);
    if (!submissionId) {
      throw new Error("Assign a participant to every prize.");
    }
    if (assignments.has(submissionId)) {
      throw new Error("Each participant can only receive one prize.");
    }
    assignments.set(submissionId, slot.id);
  }

  for (const submissionId of assignments.keys()) {
    const exists = listingSubmissions.some((row) => row.id === submissionId);
    if (!exists) {
      throw new Error("A selected participant was not found.");
    }
  }

  const now = new Date();
  const winnerIds = new Set(assignments.keys());

  store.awards = store.awards.filter((award) => award.listingId !== listingId);

  for (const [submissionId, slotId] of assignments) {
    const submission = listingSubmissions.find((row) => row.id === submissionId);
    const slot = listing.prizeSlots.find((prize) => prize.id === slotId);
    if (!submission || !slot) {
      throw new Error("Prize assignment is invalid.");
    }

    submission.status = "pending";
    submission.reviewedAt = now;
    store.awards.push({
      id: newId("award"),
      listingId,
      prizeSlotId: slot.id,
      submissionId: submission.id,
      userId: submission.userId,
      amount: slot.amount,
      status: "awarded",
      createdAt: now,
      paidAt: null,
    });
  }

  for (const submission of listingSubmissions) {
    if (!winnerIds.has(submission.id)) {
      submission.status = "rejected";
      submission.reviewedAt = now;
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath(`/bounties/${listing.slug}`);
  revalidatePath(`/admin/bounties/${listing.id}`);
}

export async function markWinnersPaidAction(formData: FormData) {
  await requireAdmin();
  const listingId = readString(formData, "listingId");
  const store = getStore();
  const listing = store.listings.find((row) => row.id === listingId);
  if (!listing) {
    throw new Error("Listing not found.");
  }

  const now = new Date();
  const awards = store.awards.filter((award) => award.listingId === listingId);

  if (awards.length === 0) {
    throw new Error("Award prizes before marking them paid.");
  }

  for (const award of awards) {
    award.status = "paid";
    award.paidAt = now;
  }

  listing.status = "closed";
  listing.updatedAt = now;

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath(`/bounties/${listing.slug}`);
  revalidatePath(`/admin/bounties/${listing.id}`);
}

export async function signOutAction() {
  await clearDemoSession();
  revalidatePath("/");
}
