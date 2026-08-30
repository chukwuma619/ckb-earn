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
  priority: "low" | "medium" | "high";
  rewardUsd: number;
  rewardLabel: string;
  winnerCount: number;
  days: number;
  tags: string[];
}> = [
  {
    slug: "ckb-explainer-thread",
    title: "Write a CKB explainer thread for newcomers",
    description:
      "Write a clear X thread that explains what CKB is, why cells matter, and why someone should care this year. Aim it at people who already understand Bitcoin or Ethereum.",
    requirements:
      "Public thread link, 8–15 posts, and a short note on the angle you took.",
    category: "content",
    type: "bounty",
    priority: "high",
    rewardUsd: 150,
    rewardLabel: "$150 in CKB",
    winnerCount: 3,
    days: 10,
    tags: ["writing", "onboarding"],
  },
  {
    slug: "promotional-ckb-graphics",
    title: "Create promotional CKB graphics",
    description:
      "Design a small set of graphics the community can reuse: one square post, one landscape banner, and one story-size asset. Keep it on-brand and usable without extra editing.",
    requirements: "Figma or downloadable PNG/SVG links for all three sizes.",
    category: "design",
    type: "bounty",
    priority: "medium",
    rewardUsd: 200,
    rewardLabel: "$200 in CKB",
    winnerCount: 2,
    days: 12,
    tags: ["graphics", "brand"],
  },
  {
    slug: "refer-external-team",
    title: "Refer an external team to build on CKB",
    description:
      "Introduce a team that is not already in the CKB community. The reward covers the time spent building rapport and making a real introduction to the Community DAO.",
    requirements:
      "Team name, contact, what they want to build, and proof of the introduction.",
    category: "community",
    type: "bounty",
    priority: "high",
    rewardUsd: 300,
    rewardLabel: "$300 in CKB",
    winnerCount: 5,
    days: 30,
    tags: ["referrals"],
  },
  {
    slug: "meme-factory",
    title: "CKB meme factory",
    description:
      "Make original memes that are actually funny and specific to CKB, Fiber, or DAO life. Low-effort templates without a CKB punchline will be skipped.",
    requirements: "Image or post link. Say where you published it.",
    category: "other",
    type: "bounty",
    priority: "low",
    rewardUsd: 50,
    rewardLabel: "$50 in CKB",
    winnerCount: 10,
    days: 14,
    tags: ["memes"],
  },
  {
    slug: "weekly-ckb-digest",
    title: "Ship a weekly CKB ecosystem digest",
    description:
      "A readable weekly recap: launches, DAO votes, Fiber news, and builder updates. This is a project — apply with a sample and your distribution plan.",
    requirements: "Sample digest and where you will publish for 4 weeks.",
    category: "content",
    type: "project",
    priority: "medium",
    rewardUsd: 250,
    rewardLabel: "$200–$250 in CKB",
    winnerCount: 1,
    days: 21,
    tags: ["writing"],
  },
  {
    slug: "fiber-getting-started-guide",
    title: "Write a Fiber getting-started guide",
    description:
      "A practical guide that takes someone from zero to a working Fiber setup. Include commands, failure points, and a short “you’re done when…” checklist.",
    requirements: "Public doc or repo README. Must be reproducible.",
    category: "development",
    type: "bounty",
    priority: "high",
    rewardUsd: 300,
    rewardLabel: "$300 in CKB",
    winnerCount: 2,
    days: 16,
    tags: ["fiber", "docs"],
  },
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
