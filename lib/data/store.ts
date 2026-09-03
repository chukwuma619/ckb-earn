import type { FormField, Listing, PrizeSlot, Profile, Submission } from "@/lib/types";
import { defaultFormFields } from "@/lib/forms";

export const DEMO_USER = {
  id: "demo-user",
  email: "demo@ckbearn.local",
  name: "Demo Builder",
} as const;

export const DEMO_AUTH_COOKIE = "ckb_earn_demo_auth";

type Store = {
  profiles: Profile[];
  listings: Listing[];
  submissions: Submission[];
};

const globalForStore = globalThis as typeof globalThis & {
  __ckbEarnStoreV8?: Store;
};

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000);
}

function prizes(...amounts: number[]): PrizeSlot[] {
  return [...amounts]
    .sort((a, b) => b - a)
    .map((amount, index) => ({
      id: `prize-${index + 1}-${amount}`,
      amount,
    }));
}

function field(
  id: string,
  type: FormField["type"],
  label: string,
  options: Partial<FormField> = {},
): FormField {
  return {
    id,
    type,
    label,
    description: options.description ?? "",
    required: options.required ?? false,
    options: options.options ?? [],
  };
}

function createSeedStore(): Store {
  const now = new Date();
  const demoProfile: Profile = {
    userId: DEMO_USER.id,
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    bio: "Exploring CKB bounties and grants.",
    ckbAddress: "ckt1qyqdemoaddress000000000000000000000000",
    twitter: "ckbearn",
    skills: "rust, typescript, content",
    isAdmin: true,
    role: "member",
    createdAt: now,
    updatedAt: now,
  };

  const listings: Listing[] = [
    {
      id: "listing-meme-factory",
      slug: "meme-factory",
      title: "Meme factory!",
      details: `## Overview

Create original memes that are actually funny and specific to CKB, Fiber, or DAO life.

## What we want

- Memes about CKB, Fiber, or community DAO culture
- Original punchlines — not generic crypto templates
- Clear CKB context so anyone in the ecosystem gets it

## What gets skipped

Low-effort templates without a CKB punchline will be skipped.

## Deliverable

Post your meme publicly and submit the link.`,
      category: "growth",
      type: "bounty",
      status: "open",
      prizeSlots: prizes(50, 50, 50, 50),
      deadline: daysFromNow(14),
      formFields: [
        field("meme-link", "url", "Meme link", {
          required: true,
          description: "Where the meme was posted",
        }),
        field("platform", "select", "Platform", {
          required: true,
          options: ["X / Twitter", "Telegram", "Discord", "Other"],
        }),
        field("notes", "long_text", "Why is this funny?", {
          required: false,
        }),
      ],
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "listing-write-article",
      slug: "write-article-new-ckbuilders",
      title: "Write an article about new CKBuilders",
      details: `## Overview

Write a clear article that explains what new builders are creating on CKB, why it matters, and how others can get involved.

## Suggested outline

1. **Who** — introduce the builders or projects
2. **What** — explain what they shipped
3. **Why it matters** — ecosystem impact
4. **How to join** — call to action for readers

## Requirements

- At least **800 words**
- Public article link
- A short note on the angle you took`,
      category: "content",
      type: "bounty",
      status: "open",
      prizeSlots: prizes(100, 75, 50),
      deadline: daysFromNow(10),
      formFields: [
        field("article-link", "url", "Article link", { required: true }),
        field("word-count", "number", "Word count", { required: true }),
        field("angle", "long_text", "Angle you took", { required: true }),
      ],
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "listing-fiber-bug",
      slug: "urgent-bug-fix-fiber",
      title: "Urgent: Fix critical bug in Fiber",
      details: `## Overview

Identify and fix a critical bug in the Fiber network implementation.

## Scope

- Reproduce the issue
- Propose a fix with a clear explanation
- Open a pull request against the main repository

## Acceptance

Your PR must be **merged** into the main repository to qualify for payment.`,
      category: "development",
      type: "bounty",
      status: "open",
      prizeSlots: prizes(2000),
      deadline: daysFromNow(5),
      formFields: [
        field("pr-link", "url", "Pull request URL", { required: true }),
        field("summary", "long_text", "Fix summary", { required: true }),
        field("merged", "checkbox", "PR is already merged", { required: true }),
      ],
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "listing-wallet-ui",
      slug: "wallet-ui-redesign",
      title: "Redesign a CKB wallet onboarding flow",
      details: `## Overview

Produce a clean onboarding UI for a CKB wallet that helps first-time users:

1. Create an address
2. Fund it
3. Send a first transaction

## Design goals

- Clear hierarchy and calm visual language
- Explain CKB concepts without jargon overload
- Mobile-friendly layouts

## Deliverable

Share a Figma or public prototype link plus a short note on the key UX decisions.`,
      category: "design",
      type: "bounty",
      status: "open",
      prizeSlots: prizes(250, 150),
      deadline: daysFromNow(21),
      formFields: [
        field("prototype-link", "url", "Figma / prototype link", {
          required: true,
        }),
        field("ux-notes", "long_text", "Key UX decisions", { required: true }),
        field("mobile", "checkbox", "Includes mobile layouts", {
          required: false,
        }),
      ],
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "listing-ecosystem-grant",
      slug: "ecosystem-tooling-grant",
      title: "Ecosystem tooling grant",
      details: `## Overview

Fund a small open-source tool that makes it easier for builders to ship on CKB.

## Proposal should include

| Section | What to cover |
| --- | --- |
| Scope | What you will build |
| Timeline | Milestone schedule |
| Impact | How the community benefits |

## Forum

Post updates on [Nervos Talk](https://talk.nervos.org/) and keep this listing linked to your thread.`,
      category: "development",
      type: "grant",
      status: "open",
      prizeSlots: prizes(2500),
      deadline: daysFromNow(45),
      formFields: defaultFormFields().concat([
        field("repo", "url", "Repository link", { required: false }),
        field("timeline", "short_text", "Estimated timeline", {
          required: true,
          description: "e.g. 6 weeks",
        }),
      ]),
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const submissions: Submission[] = [
    {
      id: "submission-demo-1",
      listingId: "listing-meme-factory",
      userId: DEMO_USER.id,
      answers: {
        "meme-link": "https://x.com/ckbearn/status/demo",
        platform: "X / Twitter",
        notes: "Posted a Fiber meme thread.",
      },
      prizeSlotId: null,
      prizeAmount: null,
      status: "pending",
      createdAt: now,
      reviewedAt: null,
    },
  ];

  return {
    profiles: [demoProfile],
    listings,
    submissions,
  };
}

export function getStore(): Store {
  if (!globalForStore.__ckbEarnStoreV8) {
    globalForStore.__ckbEarnStoreV8 = createSeedStore();
  }
  return globalForStore.__ckbEarnStoreV8;
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
