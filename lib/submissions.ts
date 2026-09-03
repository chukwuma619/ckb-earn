import { getStore } from "@/lib/data/store";

export async function getUserSubmission(listingId: string, userId: string) {
  return (
    getStore().submissions.find(
      (submission) =>
        submission.listingId === listingId && submission.userId === userId,
    ) ?? null
  );
}

export async function listUserSubmissions(userId: string) {
  const store = getStore();
  return store.submissions
    .filter((submission) => submission.userId === userId)
    .map((submission) => {
      const listing = store.listings.find(
        (row) => row.id === submission.listingId,
      );
      if (!listing) {
        return null;
      }
      return { submission, listing };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort(
      (a, b) =>
        b.submission.createdAt.getTime() - a.submission.createdAt.getTime(),
    );
}

export async function listListingSubmissions(listingId: string) {
  const store = getStore();
  return store.submissions
    .filter((submission) => submission.listingId === listingId)
    .map((submission) => {
      const profile = store.profiles.find(
        (row) => row.userId === submission.userId,
      );
      if (!profile) {
        return null;
      }
      return { submission, profile };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort(
      (a, b) =>
        b.submission.createdAt.getTime() - a.submission.createdAt.getTime(),
    );
}

export async function listRecentSubmissions(limit = 20) {
  const store = getStore();
  return store.submissions
    .map((submission) => {
      const listing = store.listings.find(
        (row) => row.id === submission.listingId,
      );
      const profile = store.profiles.find(
        (row) => row.userId === submission.userId,
      );
      if (!listing || !profile) {
        return null;
      }
      return { submission, listing, profile };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort(
      (a, b) =>
        b.submission.createdAt.getTime() - a.submission.createdAt.getTime(),
    )
    .slice(0, limit);
}
