import type { Listing, Profile, Submission } from "@/lib/types";

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
  __ckbEarnStoreV2?: Store;
};

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000);
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
      description:
        "Create original memes that are actually funny and specific to CKB, Fiber, or DAO life. Low-effort templates without a CKB punchline will be skipped.",
      requirements: "Image or post link. Say where you published it.",
      type: "bounty",
      status: "open",
      forumThreadUrl: null,
      isMilestoneBased: false,
      rewardUsd: 50,
      rewardLabel: "$50 in CKB",
      winnerCount: 10,
      deadline: daysFromNow(14),
      tags: ["memes", "growth"],
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "listing-write-article",
      slug: "write-article-new-ckbuilders",
      title: "Write an article about new CKBuilders",
      description:
        "Write a clear article that explains what new builders are creating on CKB, why it matters, and how others can get involved.",
      requirements:
        "Public article link, at least 800 words, and a short note on the angle you took.",
      type: "bounty",
      status: "open",
      forumThreadUrl: null,
      isMilestoneBased: false,
      rewardUsd: 150,
      rewardLabel: "$150 in CKB",
      winnerCount: 3,
      deadline: daysFromNow(10),
      tags: ["writing", "builders"],
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "listing-fiber-bug",
      slug: "urgent-bug-fix-fiber",
      title: "Urgent: Fix critical bug in Fiber",
      description:
        "Identify and fix a critical bug in the Fiber network implementation.",
      requirements: "PR merged into the main repository.",
      type: "bounty",
      status: "open",
      forumThreadUrl: null,
      isMilestoneBased: false,
      rewardUsd: 2000,
      rewardLabel: "$2000 in CKB",
      winnerCount: 1,
      deadline: daysFromNow(5),
      tags: ["bug", "fiber", "urgent"],
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "listing-ecosystem-grant",
      slug: "ecosystem-tooling-grant",
      title: "Ecosystem tooling grant",
      description:
        "Fund a small open-source tool that makes it easier for builders to ship on CKB.",
      requirements:
        "Short proposal with scope, timeline, and how the community benefits.",
      type: "grant",
      status: "open",
      forumThreadUrl: "https://talk.nervos.org/",
      isMilestoneBased: true,
      rewardUsd: 2500,
      rewardLabel: "Up to $2500 in CKB",
      winnerCount: 2,
      deadline: daysFromNow(45),
      tags: ["tooling", "grants"],
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
      link: "https://x.com/ckbearn/status/demo",
      forumPostUrl: null,
      milestoneNumber: null,
      notes: "Posted a Fiber meme thread.",
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
  if (!globalForStore.__ckbEarnStoreV2) {
    globalForStore.__ckbEarnStoreV2 = createSeedStore();
  }
  return globalForStore.__ckbEarnStoreV2;
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
