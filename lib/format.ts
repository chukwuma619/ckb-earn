import type {
  AwardStatus,
  ListingCategory,
  ListingStatus,
  ListingType,
  SubmissionStatus,
} from "@/lib/types";

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDeadline(deadline: Date | null) {
  if (!deadline) {
    return "Open until filled";
  }

  const now = Date.now();
  const ms = deadline.getTime() - now;
  if (ms <= 0) {
    return "Closed";
  }

  const days = Math.ceil(ms / 86_400_000);
  if (days === 1) {
    return "Due tomorrow";
  }

  if (days < 14) {
    return `Due in ${days}d`;
  }

  return deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function categoryLabel(category: ListingCategory) {
  switch (category) {
    case "content":
      return "Content";
    case "development":
      return "Development";
    case "design":
      return "Design";
    case "growth":
      return "Growth";
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}

export function typeLabel(type: ListingType) {
  switch (type) {
    case "bounty":
      return "Bounty";
    case "grant":
      return "Grant";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function statusLabel(status: ListingStatus) {
  switch (status) {
    case "draft":
      return "Draft";
    case "open":
      return "Open";
    case "closed":
      return "Closed";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function submissionStatusLabel(status: SubmissionStatus) {
  switch (status) {
    case "pending":
      return "Pending review";
    case "rejected":
      return "Not selected";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function awardStatusLabel(status: AwardStatus) {
  switch (status) {
    case "awarded":
      return "Awarded";
    case "paid":
      return "Paid";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
