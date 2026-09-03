export const listingCategories = [
  "content",
  "build",
  "growth",
  "pioneer",
  "leadership",
  "dao",
] as const;

export const listingTypes = ["bounty", "grant"] as const;

export const listingStatuses = [
  "draft",
  "open",
  "reviewing",
  "awarded",
  "closed",
] as const;

export const listingPriorities = ["standard", "high", "urgent"] as const;

export const submissionStatuses = [
  "pending",
  "winner",
  "rejected",
  "paid",
] as const;

export type ListingCategory = (typeof listingCategories)[number];
export type ListingType = (typeof listingTypes)[number];
export type ListingStatus = (typeof listingStatuses)[number];
export type ListingPriority = (typeof listingPriorities)[number];
export type SubmissionStatus = (typeof submissionStatuses)[number];

export type Profile = {
  userId: string;
  email: string;
  name: string;
  bio: string;
  ckbAddress: string;
  twitter: string;
  skills: string;
  isAdmin: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Listing = {
  id: string;
  slug: string;
  title: string;
  description: string;
  requirements: string;
  category: ListingCategory;
  type: ListingType;
  status: ListingStatus;
  priority: ListingPriority;
  forumThreadUrl: string | null;
  isMilestoneBased: boolean;
  rewardUsd: number;
  rewardLabel: string;
  winnerCount: number;
  deadline: Date | null;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Submission = {
  id: string;
  listingId: string;
  userId: string;
  link: string;
  forumPostUrl: string | null;
  milestoneNumber: number | null;
  notes: string;
  status: SubmissionStatus;
  createdAt: Date;
  reviewedAt: Date | null;
};
