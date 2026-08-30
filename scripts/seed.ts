import { eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import { listings, type ListingCategory, type ListingType } from "../lib/db/schema";

const seeds: Array<{
  slug: string;
  title: string;
  description: string;
  requirements: string;
  category: ListingCategory;
  type: ListingType;
  priority: "standard" | "high" | "urgent";
  rewardUsd: number;
  rewardLabel: string;
  winnerCount: number;
  days: number;
  tags: string[];
  forumThreadUrl?: string;
  isMilestoneBased?: boolean;
}> = [
  {
    slug: "meme-factory",
    title: "Meme factory!",
    description:
      "Create original memes that are actually funny and specific to CKB, Fiber, or DAO life. Low-effort templates without a CKB punchline will be skipped.",
    requirements: "Image or post link. Say where you published it.",
    category: "growth",
    type: "bounty",
    priority: "standard",
    rewardUsd: 50,
    rewardLabel: "$50 in CKB",
    winnerCount: 10,
    days: 14,
    tags: ["memes", "growth"],
  },
  {
    slug: "write-article-new-ckbuilders",
    title: "Write an article about new CKBuilders",
    description:
      "Write a clear article that explains what new builders are creating on CKB, why it matters, and how others can get involved.",
    requirements:
      "Public article link, at least 800 words, and a short note on the angle you took.",
    category: "content",
    type: "bounty",
    priority: "high",
    rewardUsd: 150,
    rewardLabel: "$150 in CKB",
    winnerCount: 3,
    days: 10,
    tags: ["writing", "builders"],
  },
  {
    slug: "spark-milestone-proposals",
    title: "Spark Milestone Proposals",
    description:
      "Submit a proposal for a Spark mini-grant. This is for small, milestone-based projects that benefit the CKB ecosystem.",
    requirements:
      "A detailed proposal including milestones, budget, and expected impact.",
    category: "build",
    type: "spark",
    priority: "standard",
    rewardUsd: 1000,
    rewardLabel: "Up to $1000 in CKB",
    winnerCount: 5,
    days: 30,
    tags: ["spark", "grants", "milestones"],
    forumThreadUrl: "https://talk.nervos.org/t/spark-mini-grants/1234",
    isMilestoneBased: true,
  },
  {
    slug: "permanent-bounty-translations",
    title: "Permanent Translation Bounty",
    description:
      "Translate CKB documentation, articles, and announcements into other languages. This is a recurring bounty.",
    requirements:
      "Link to the translated content and the original source.",
    category: "content",
    type: "permanent",
    priority: "standard",
    rewardUsd: 100,
    rewardLabel: "$100 in CKB per translation",
    winnerCount: 20,
    days: 365,
    tags: ["translation", "recurring"],
  },
  {
    slug: "urgent-bug-fix-fiber",
    title: "Urgent: Fix critical bug in Fiber",
    description:
      "Identify and fix a critical bug in the Fiber network implementation.",
    requirements:
      "PR merged into the main repository.",
    category: "build",
    type: "bounty",
    priority: "urgent",
    rewardUsd: 2000,
    rewardLabel: "$2000 in CKB",
    winnerCount: 1,
    days: 5,
    tags: ["bug", "fiber", "urgent"],
  }
];

async function main() {
  const db = getDb();

  for (const seed of seeds) {
    const existing = await db
      .select({ id: listings.id })
      .from(listings)
      .where(eq(listings.slug, seed.slug))
      .limit(1);

    const values = {
      title: seed.title,
      description: seed.description,
      requirements: seed.requirements,
      category: seed.category,
      type: seed.type,
      status: "open" as const,
      priority: seed.priority,
      rewardUsd: seed.rewardUsd,
      rewardLabel: seed.rewardLabel,
      winnerCount: seed.winnerCount,
      deadline: new Date(Date.now() + seed.days * 86_400_000),
      tags: seed.tags,
      forumThreadUrl: seed.forumThreadUrl || null,
      isMilestoneBased: seed.isMilestoneBased || false,
      createdBy: "system",
      updatedAt: new Date(),
    };

    if (existing[0]) {
      await db.update(listings).set(values).where(eq(listings.id, existing[0].id));
    } else {
      await db.insert(listings).values({ ...values, slug: seed.slug });
    }
  }

  console.log(`Seeded ${seeds.length} listings`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
