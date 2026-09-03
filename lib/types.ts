export const listingCategories = [
  "content",
  "development",
  "design",
  "growth",
] as const;

export const listingTypes = ["bounty", "grant"] as const;

export const listingStatuses = ["draft", "open", "closed"] as const;

export const submissionStatuses = [
  "pending",
  "winner",
  "rejected",
  "paid",
] as const;

export const formFieldTypes = [
  "short_text",
  "long_text",
  "url",
  "number",
  "select",
  "checkbox",
] as const;

export type ListingCategory = (typeof listingCategories)[number];
export type ListingType = (typeof listingTypes)[number];
export type ListingStatus = (typeof listingStatuses)[number];
export type SubmissionStatus = (typeof submissionStatuses)[number];
export type FormFieldType = (typeof formFieldTypes)[number];

export type FormField = {
  id: string;
  type: FormFieldType;
  label: string;
  description: string;
  required: boolean;
  options: string[];
};

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
  details: string;
  category: ListingCategory;
  type: ListingType;
  status: ListingStatus;
  rewardAmount: number;
  deadline: Date | null;
  formFields: FormField[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Submission = {
  id: string;
  listingId: string;
  userId: string;
  answers: Record<string, string>;
  status: SubmissionStatus;
  createdAt: Date;
  reviewedAt: Date | null;
};
