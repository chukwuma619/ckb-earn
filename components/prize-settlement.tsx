import {
  endListingAction,
  markWinnersPaidAction,
  settlePrizesAction,
} from "@/lib/actions";
import { awardForPrizeSlot } from "@/lib/awards";
import { awardStatusLabel, formatUsd } from "@/lib/format";
import { prizePoolTotal, prizeSlotLabel, sortPrizeSlots } from "@/lib/prizes";
import type { Award, Listing, Profile, Submission } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

type Row = {
  submission: Submission;
  profile: Profile;
};

export function PrizeSettlement({
  listing,
  submissions,
  awards,
  ended,
}: {
  listing: Listing;
  submissions: Row[];
  awards: Award[];
  ended: boolean;
}) {
  const prizes = sortPrizeSlots(listing.prizeSlots);
  const allPaid =
    prizes.length > 0 &&
    prizes.every((slot) => awardForPrizeSlot(awards, slot.id)?.status === "paid");
  const awarded = awards.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settle prizes</CardTitle>
        <CardDescription>
          When the bounty ends, pick who gets each prize from the people who
          submitted. Awards are stored separately from submissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Pool {formatUsd(prizePoolTotal(prizes))} · {prizes.length} prize
          {prizes.length === 1 ? "" : "s"} · {submissions.length} participant
          {submissions.length === 1 ? "" : "s"}
        </p>

        {!ended ? (
          <form action={endListingAction}>
            <input type="hidden" name="listingId" value={listing.id} />
            <Button type="submit" variant="outline">
              End bounty
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Stops new submissions so you can award prizes.
            </p>
          </form>
        ) : null}

        {ended && submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No one submitted, so there is nothing to settle.
          </p>
        ) : null}

        {ended && submissions.length > 0 && !allPaid ? (
          <form action={settlePrizesAction}>
            <input type="hidden" name="listingId" value={listing.id} />
            <FieldGroup>
              {prizes.map((slot, index) => {
                const current = awardForPrizeSlot(awards, slot.id);
                return (
                  <Field key={slot.id}>
                    <FieldLabel htmlFor={`prize_${slot.id}`}>
                      {prizeSlotLabel(index)} · {formatUsd(slot.amount)}
                    </FieldLabel>
                    <NativeSelect
                      id={`prize_${slot.id}`}
                      name={`prize_${slot.id}`}
                      required
                      className="w-full"
                      defaultValue={current?.submissionId ?? ""}
                    >
                      <NativeSelectOption value="">
                        Choose a participant
                      </NativeSelectOption>
                      {submissions.map(({ submission, profile }) => (
                        <NativeSelectOption
                          key={submission.id}
                          value={submission.id}
                        >
                          {profile.name} · {profile.email}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                );
              })}
              <Button type="submit">Award prizes</Button>
              <p className="text-xs text-muted-foreground">
                Everyone else is marked not selected.
              </p>
            </FieldGroup>
          </form>
        ) : null}

        {awarded ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Payout list</p>
            <ul className="space-y-2 text-sm">
              {prizes.map((slot, index) => {
                const award = awardForPrizeSlot(awards, slot.id);
                const winner = submissions.find(
                  (row) => row.submission.id === award?.submissionId,
                );
                if (!award || !winner) {
                  return (
                    <li key={slot.id} className="text-muted-foreground">
                      {prizeSlotLabel(index)} · {formatUsd(slot.amount)} — unassigned
                    </li>
                  );
                }
                return (
                  <li key={slot.id}>
                    <span className="font-medium">
                      {prizeSlotLabel(index)} · {formatUsd(award.amount)}
                    </span>
                    <span className="mt-0.5 block text-muted-foreground">
                      {winner.profile.name} ·{" "}
                      {winner.profile.ckbAddress || "No CKB address yet"} ·{" "}
                      {awardStatusLabel(award.status)}
                    </span>
                  </li>
                );
              })}
            </ul>
            {!allPaid ? (
              <form action={markWinnersPaidAction}>
                <input type="hidden" name="listingId" value={listing.id} />
                <Button type="submit">Mark winners paid</Button>
              </form>
            ) : (
              <p className="text-sm font-medium">All prizes have been paid.</p>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
