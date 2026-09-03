"use client";

import { useState } from "react";
import {
  createFormField,
  defaultFormFields,
  formFieldTypeLabel,
} from "@/lib/forms";
import {
  formFieldTypes,
  type FormField,
  type FormFieldType,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

export function SubmissionFormBuilder({
  initialFields,
}: {
  initialFields?: FormField[];
}) {
  const [fields, setFields] = useState<FormField[]>(
    initialFields?.length ? initialFields : defaultFormFields(),
  );

  function updateField(id: string, patch: Partial<FormField>) {
    setFields((current) =>
      current.map((field) => (field.id === id ? { ...field, ...patch } : field)),
    );
  }

  function removeField(id: string) {
    setFields((current) =>
      current.length <= 1 ? current : current.filter((field) => field.id !== id),
    );
  }

  function moveField(id: string, direction: -1 | 1) {
    setFields((current) => {
      const index = current.findIndex((field) => field.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  }

  return (
    <FieldGroup className="gap-4 rounded-[4px] border border-border p-4">
      <div>
        <h3 className="text-sm font-semibold">Submission form</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Build the questions applicants must answer — like a Google Form.
        </p>
      </div>

      <input type="hidden" name="formFields" value={JSON.stringify(fields)} />

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-3 rounded-[4px] border border-border bg-muted/30 p-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                Question {index + 1}
              </p>
              {field.required ? (
                <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                  Required
                </span>
              ) : (
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Optional
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveField(field.id, -1)}
                disabled={index === 0}
              >
                Up
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveField(field.id, 1)}
                disabled={index === fields.length - 1}
              >
                Down
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeField(field.id)}
                disabled={fields.length <= 1}
              >
                Remove
              </Button>
            </div>
          </div>

          <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`label-${field.id}`}>Label</FieldLabel>
              <Input
                id={`label-${field.id}`}
                value={field.label}
                onChange={(event) =>
                  updateField(field.id, { label: event.target.value })
                }
                placeholder="Question shown to submitters"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`type-${field.id}`}>Input type</FieldLabel>
              <NativeSelect
                id={`type-${field.id}`}
                value={field.type}
                className="w-full"
                onChange={(event) =>
                  updateField(field.id, {
                    type: event.target.value as FormFieldType,
                    options:
                      event.target.value === "select"
                        ? field.options.length
                          ? field.options
                          : ["Option 1"]
                        : [],
                  })
                }
              >
                {formFieldTypes.map((type) => (
                  <NativeSelectOption key={type} value={type}>
                    {formFieldTypeLabel(type)}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor={`description-${field.id}`}>Description</FieldLabel>
            <Input
              id={`description-${field.id}`}
              value={field.description}
              onChange={(event) =>
                updateField(field.id, { description: event.target.value })
              }
              placeholder="Help text shown under the label"
            />
          </Field>

          {field.type === "select" ? (
            <Field>
              <FieldLabel htmlFor={`options-${field.id}`}>Options</FieldLabel>
              <Textarea
                id={`options-${field.id}`}
                rows={3}
                value={field.options.join("\n")}
                onChange={(event) =>
                  updateField(field.id, {
                    options: event.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  })
                }
                placeholder={"One option per line"}
              />
              <FieldDescription>One option per line</FieldDescription>
            </Field>
          ) : null}

          <label className="flex items-start gap-2 rounded-[4px] border border-border bg-background px-3 py-2 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4 rounded border border-input"
              checked={field.required}
              onChange={(event) =>
                updateField(field.id, { required: event.target.checked })
              }
            />
            <span>
              <span className="font-medium">Required</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Submitters must answer this before they can submit.
              </span>
            </span>
          </label>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => setFields((current) => [...current, createFormField()])}
      >
        Add question
      </Button>
    </FieldGroup>
  );
}
