"use client";

import { useMemo, useState } from "react";
import {
  createPrizeSlot,
  defaultPrizeSlots,
  formatPrizeBreakdown,
  prizePoolTotal,
  prizeSlotLabel,
  sortPrizeSlots,
} from "@/lib/prizes";
import { formatUsd } from "@/lib/format";
import type { PrizeSlot } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function PrizeSlotsBuilder({
  initialSlots,
}: {
  initialSlots?: PrizeSlot[];
}) {
  const [slots, setSlots] = useState<PrizeSlot[]>(
    initialSlots?.length ? sortPrizeSlots(initialSlots) : defaultPrizeSlots(),
  );

  const ordered = useMemo(() => sortPrizeSlots(slots), [slots]);
  const total = useMemo(() => prizePoolTotal(ordered), [ordered]);

  function updateAmount(id: string, amount: number) {
    setSlots((current) =>
      sortPrizeSlots(
        current.map((slot) => (slot.id === id ? { ...slot, amount } : slot)),
      ),
    );
  }

  function removeSlot(id: string) {
    setSlots((current) =>
      current.length <= 1 ? current : current.filter((slot) => slot.id !== id),
    );
  }

  function fillEqual(count: number, amount: number) {
    setSlots(Array.from({ length: count }, () => createPrizeSlot(amount)));
  }

  function fillRanked(amounts: number[]) {
    setSlots(sortPrizeSlots(amounts.map((amount) => createPrizeSlot(amount))));
  }

  return (
    <FieldGroup className="gap-4 rounded-[4px] border border-border p-4">
      <div>
        <h3 className="text-sm font-semibold">Prizes</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Highest amount is 1st prize. Add equal amounts for a split, or
          different amounts for ranked payouts.
        </p>
      </div>

      <input type="hidden" name="prizeSlots" value={JSON.stringify(ordered)} />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fillRanked([100, 75, 50])}
        >
          Ranked $100 / $75 / $50
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fillEqual(4, 50)}
        >
          Equal $50 × 4
        </Button>
      </div>

      {ordered.map((slot, index) => (
        <div
          key={slot.id}
          className="grid grid-cols-[1fr_auto] items-end gap-3 rounded-[4px] border border-border bg-muted/30 p-3"
        >
          <Field>
            <FieldLabel htmlFor={`prize-amount-${slot.id}`}>
              {prizeSlotLabel(index)}
            </FieldLabel>
            <Input
              id={`prize-amount-${slot.id}`}
              type="number"
              min="1"
              value={slot.amount}
              onChange={(event) =>
                updateAmount(slot.id, Number(event.target.value) || 0)
              }
            />
          </Field>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeSlot(slot.id)}
            disabled={slots.length <= 1}
          >
            Remove
          </Button>
        </div>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setSlots((current) => sortPrizeSlots([...current, createPrizeSlot()]))
          }
        >
          Add prize
        </Button>
        <p className="text-sm text-muted-foreground">
          {formatPrizeBreakdown(ordered)} · pool {formatUsd(total)}
        </p>
      </div>
    </FieldGroup>
  );
}
