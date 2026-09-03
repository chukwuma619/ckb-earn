import { upsertListingAction } from "@/lib/actions";
import {
  listingCategories,
  listingStatuses,
  listingTypes,
  type Listing,
} from "@/lib/types";
import { categoryLabel, statusLabel, typeLabel } from "@/lib/format";
import { redirect } from "next/navigation";
import { SubmissionFormBuilder } from "@/components/submission-form-builder";
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
          <FieldLabel htmlFor="details">Details</FieldLabel>
          <Textarea
            id="details"
            name="details"
            required
            rows={12}
            defaultValue={listing?.details}
            placeholder="Write the full project details in Markdown..."
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Supports Markdown: headings, lists, links, code blocks, and more.
          </p>
        </Field>
        <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <FieldLabel htmlFor="rewardAmount">Reward amount (USD)</FieldLabel>
            <Input
              id="rewardAmount"
              name="rewardAmount"
              type="number"
              min="0"
              defaultValue={listing?.rewardAmount ?? 100}
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

        <SubmissionFormBuilder initialFields={listing?.formFields} />

        <Button type="submit">{listing ? "Save listing" : "Publish listing"}</Button>
      </FieldGroup>
    </form>
  );
}
