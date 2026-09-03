import { upsertListingAction } from "@/lib/actions";
import {
  listingCategories,
  listingPriorities,
  listingStatuses,
  listingTypes,
  type Listing,
} from "@/lib/db/schema";
import { categoryLabel, priorityLabel, statusLabel, typeLabel } from "@/lib/format";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

async function saveListing(formData: FormData) {
  "use server";
  await upsertListingAction(formData);
  redirect("/admin");
}

function deadlineValue(deadline: Date | null) {
  if (!deadline) {
    return "";
  }
  return deadline.toISOString().slice(0, 16);
}

export function ListingForm({ listing }: { listing?: Listing }) {
  return (
    <form action={saveListing}>
      {listing ? <input type="hidden" name="id" value={listing.id} /> : null}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" name="title" required defaultValue={listing?.title} />
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            required
            rows={6}
            defaultValue={listing?.description}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="requirements">What to submit</FieldLabel>
          <Textarea
            id="requirements"
            name="requirements"
            rows={3}
            defaultValue={listing?.requirements}
          />
        </Field>
        <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="type">Type</FieldLabel>
            <NativeSelect
              id="type"
              name="type"
              defaultValue={listing?.type ?? "bounty"}
              className="w-full"
            >
              {listingTypes.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {typeLabel(value)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <NativeSelect
              id="category"
              name="category"
              defaultValue={listing?.category ?? "content"}
              className="w-full"
            >
              {listingCategories.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {categoryLabel(value)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <NativeSelect
              id="status"
              name="status"
              defaultValue={listing?.status ?? "open"}
              className="w-full"
            >
              {listingStatuses.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {statusLabel(value)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="priority">Priority</FieldLabel>
            <NativeSelect
              id="priority"
              name="priority"
              defaultValue={listing?.priority ?? "standard"}
              className="w-full"
            >
              {listingPriorities.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {priorityLabel(value)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="rewardUsd">Reward USD</FieldLabel>
            <Input
              id="rewardUsd"
              name="rewardUsd"
              type="number"
              min="0"
              defaultValue={listing?.rewardUsd ?? 100}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="rewardLabel">Reward label</FieldLabel>
            <Input
              id="rewardLabel"
              name="rewardLabel"
              defaultValue={listing?.rewardLabel ?? "$100 in CKB"}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="winnerCount">Winners</FieldLabel>
            <Input
              id="winnerCount"
              name="winnerCount"
              type="number"
              min="1"
              defaultValue={listing?.winnerCount ?? 1}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="deadline">Deadline</FieldLabel>
            <Input
              id="deadline"
              name="deadline"
              type="datetime-local"
              defaultValue={deadlineValue(listing?.deadline ?? null)}
            />
          </Field>
        </FieldGroup>
        <Field>
          <FieldLabel htmlFor="tags">Tags</FieldLabel>
          <Input
            id="tags"
            name="tags"
            defaultValue={listing?.tags.join(", ")}
            placeholder="writing, fiber"
          />
        </Field>
        <Button type="submit">{listing ? "Save listing" : "Publish listing"}</Button>
      </FieldGroup>
    </form>
  );
}
