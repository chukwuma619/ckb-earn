import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

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

export const profiles = pgTable(
  "profiles",
  {
    userId: text("user_id").primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    bio: text("bio").notNull().default(""),
    ckbAddress: text("ckb_address").notNull().default(""),
    twitter: text("twitter").notNull().default(""),
    skills: text("skills").notNull().default(""),
    isAdmin: boolean("is_admin").notNull().default(false),
    role: text("role").notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("profiles_email_idx").on(table.email)],
);

export const listings = pgTable(
  "listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    requirements: text("requirements").notNull().default(""),
    category: text("category").notNull().$type<ListingCategory>(),
    type: text("type").notNull().$type<ListingType>(),
    status: text("status").notNull().$type<ListingStatus>().default("open"),
    priority: text("priority")
      .notNull()
      .$type<ListingPriority>()
      .default("standard"),
    forumThreadUrl: text("forum_thread_url"),
    isMilestoneBased: boolean("is_milestone_based").notNull().default(false),
    rewardUsd: integer("reward_usd").notNull(),
    rewardLabel: text("reward_label").notNull(),
    winnerCount: integer("winner_count").notNull().default(1),
    deadline: timestamp("deadline", { withTimezone: true }),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    createdBy: text("created_by").notNull().default("system"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("listings_slug_idx").on(table.slug),
    index("listings_status_idx").on(table.status),
    index("listings_category_idx").on(table.category),
  ],
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => profiles.userId, { onDelete: "cascade" }),
    link: text("link").notNull(),
    forumPostUrl: text("forum_post_url"),
    milestoneNumber: integer("milestone_number"),
    notes: text("notes").notNull().default(""),
    status: text("status")
      .notNull()
      .$type<SubmissionStatus>()
      .default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("submissions_listing_user_idx").on(
      table.listingId,
      table.userId,
    ),
    index("submissions_listing_idx").on(table.listingId),
    index("submissions_user_idx").on(table.userId),
  ],
);

export type Profile = typeof profiles.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
