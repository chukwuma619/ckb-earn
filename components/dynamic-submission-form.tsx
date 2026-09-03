import type { FormField, Submission } from "@/lib/types";
import { submitToListingAction } from "@/lib/actions";
import { submissionStatusLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

function FieldInput({
  field,
  defaultValue,
}: {
  field: FormField;
  defaultValue?: string;
}) {
  const name = `field_${field.id}`;
  const id = name;

  switch (field.type) {
    case "short_text":
      return (
        <Input
          id={id}
          name={name}
          required={field.required}
          defaultValue={defaultValue}
        />
      );
    case "long_text":
      return (
        <Textarea
          id={id}
          name={name}
          rows={4}
          required={field.required}
          defaultValue={defaultValue}
        />
      );
    case "url":
      return (
        <Input
          id={id}
          name={name}
          type="url"
          required={field.required}
          defaultValue={defaultValue}
          placeholder="https://"
        />
      );
    case "number":
      return (
        <Input
          id={id}
          name={name}
          type="number"
          required={field.required}
          defaultValue={defaultValue}
        />
      );
    case "select":
      return (
        <NativeSelect
          id={id}
          name={name}
          required={field.required}
          defaultValue={defaultValue ?? ""}
          className="w-full"
        >
          <NativeSelectOption value="" disabled={field.required}>
            Select an option
          </NativeSelectOption>
          {field.options.map((option) => (
            <NativeSelectOption key={option} value={option}>
              {option}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            id={id}
            name={name}
            type="checkbox"
            value="on"
            defaultChecked={defaultValue === "yes"}
            required={field.required}
            className="size-4 rounded border border-input"
          />
          <span>Yes</span>
        </label>
      );
    default: {
      const _exhaustive: never = field.type;
      return _exhaustive;
    }
  }
}

function SubmissionQuestion({
  field,
  defaultValue,
}: {
  field: FormField;
  defaultValue?: string;
}) {
  return (
    <Field>
      <FieldContent>
        <FieldLabel htmlFor={`field_${field.id}`}>
          {field.label}
          {field.required ? (
            <span className="text-destructive" aria-label="required">
              *
            </span>
          ) : (
            <span className="font-normal text-muted-foreground">(optional)</span>
          )}
        </FieldLabel>
        {field.description ? (
          <FieldDescription>{field.description}</FieldDescription>
        ) : null}
      </FieldContent>
      <FieldInput field={field} defaultValue={defaultValue} />
    </Field>
  );
}

export function DynamicSubmissionForm({
  listingId,
  fields,
  existing,
}: {
  listingId: string;
  fields: FormField[];
  existing: Submission | null;
}) {
  return (
    <form action={submitToListingAction}>
      <input type="hidden" name="listingId" value={listingId} />
      <FieldGroup>
        {fields.map((field) => (
          <SubmissionQuestion
            key={field.id}
            field={field}
            defaultValue={existing?.answers[field.id]}
          />
        ))}
        <Button type="submit">
          {existing ? "Update submission" : "Submit"}
        </Button>
        {existing ? (
          <p className="text-xs text-muted-foreground">
            {submissionStatusLabel(existing.status)}
          </p>
        ) : null}
      </FieldGroup>
    </form>
  );
}
