import { getStore } from "@/lib/data/store";
import type { Award } from "@/lib/types";

export function listListingAwards(listingId: string) {
  return getStore().awards.filter((award) => award.listingId === listingId);
}

export function getAwardForSubmission(submissionId: string) {
  return (
    getStore().awards.find((award) => award.submissionId === submissionId) ??
    null
  );
}

export function assignedPrizeSlotIds(awards: Award[]) {
  return new Set(awards.map((award) => award.prizeSlotId));
}

export function awardForPrizeSlot(awards: Award[], prizeSlotId: string) {
  return awards.find((award) => award.prizeSlotId === prizeSlotId) ?? null;
}
