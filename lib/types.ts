export const listingCategories = [
  "content",
  "development",
  "design",
  "growth",
] as const;

export const listingTypes = ["bounty", "grant"] as const;

export const listingStatuses = ["draft", "open", "closed"] as const;

export const submissionStatuses = ["pending", "rejected"] as const;

export const awardStatuses = ["awarded", "paid"] as const;

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
export type AwardStatus = (typeof awardStatuses)[number];
export type FormFieldType = (typeof formFieldTypes)[number];

export type FormField = {
  id: string;
  type: FormFieldType;
  label: string;
  description: string;
  required: boolean;
  options: string[];
};

export type PrizeSlot = {
  id: string;
  amount: number;
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
  prizeSlots: PrizeSlot[];
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

export type Award = {
  id: string;
  listingId: string;
  prizeSlotId: string;
  submissionId: string;
  userId: string;
  amount: number;
  status: AwardStatus;
  createdAt: Date;
  paidAt: Date | null;
};
