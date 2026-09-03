import type {
  ListingCategory,
  ListingPriority,
  ListingStatus,
  ListingType,
  SubmissionStatus,
} from "@/lib/db/schema";

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
    case "build":
      return "Build";
    case "growth":
      return "Growth";
    case "pioneer":
      return "Pioneer";
    case "leadership":
      return "Leadership";
    case "dao":
      return "DAO";
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
    case "reviewing":
      return "Reviewing";
    case "awarded":
      return "Awarded";
    case "closed":
      return "Closed";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function priorityLabel(priority: ListingPriority) {
  switch (priority) {
    case "standard":
      return "Standard";
    case "high":
      return "High";
    case "urgent":
      return "Urgent";
    default: {
      const _exhaustive: never = priority;
      return _exhaustive;
    }
  }
}

export function submissionStatusLabel(status: SubmissionStatus) {
  switch (status) {
    case "pending":
      return "Pending review";
    case "winner":
      return "Winner";
    case "rejected":
      return "Not selected";
    case "paid":
      return "Paid";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
