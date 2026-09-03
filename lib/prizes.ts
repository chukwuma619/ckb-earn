import type { PrizeSlot } from "@/lib/types";
import { formatUsd } from "@/lib/format";

export function ordinalLabel(place: number) {
  const remainder = place % 100;
  if (remainder >= 11 && remainder <= 13) {
    return `${place}th`;
  }

  switch (place % 10) {
    case 1:
      return `${place}st`;
    case 2:
      return `${place}nd`;
    case 3:
      return `${place}rd`;
    default:
      return `${place}th`;
  }
}

export function sortPrizeSlots(slots: PrizeSlot[]) {
  return [...slots].sort((a, b) => b.amount - a.amount);
}

export function defaultPrizeSlots(): PrizeSlot[] {
  return [
    {
      id: crypto.randomUUID(),
      amount: 100,
    },
  ];
}

export function createPrizeSlot(amount = 50): PrizeSlot {
  return {
    id: crypto.randomUUID(),
    amount,
  };
}

export function prizeSlotLabel(index: number) {
  return `${ordinalLabel(index + 1)} prize`;
}

export function prizePoolTotal(slots: PrizeSlot[]) {
  return slots.reduce((sum, slot) => sum + slot.amount, 0);
}

export function formatPrizeBreakdown(slots: PrizeSlot[]) {
  const amounts = sortPrizeSlots(slots).map((slot) => slot.amount);
  if (amounts.length === 0) {
    return formatUsd(0);
  }

  const first = amounts[0];
  const allEqual = amounts.every((amount) => amount === first);

  if (allEqual && amounts.length > 1) {
    return `${formatUsd(first)} × ${amounts.length}`;
  }

  return amounts.map((amount) => formatUsd(amount)).join(" / ");
}

export function parsePrizeSlotsJson(raw: string): PrizeSlot[] {
  if (!raw.trim()) {
    throw new Error("Add at least one prize slot.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Prize slots are invalid.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Prize slots are invalid.");
  }

  const slots: PrizeSlot[] = [];

  for (const [index, item] of parsed.entries()) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const row = item as Record<string, unknown>;
    const amount = Number(row.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`Prize ${index + 1} needs an amount greater than 0.`);
    }

    slots.push({
      id: String(row.id ?? crypto.randomUUID()),
      amount,
    });
  }

  if (slots.length === 0) {
    throw new Error("Add at least one prize slot.");
  }

  return sortPrizeSlots(slots);
}
