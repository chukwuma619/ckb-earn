import {
  formFieldTypes,
  type FormField,
  type FormFieldType,
} from "@/lib/types";

export function formFieldTypeLabel(type: FormFieldType) {
  switch (type) {
    case "short_text":
      return "Short answer";
    case "long_text":
      return "Paragraph";
    case "url":
      return "Link / URL";
    case "number":
      return "Number";
    case "select":
      return "Dropdown";
    case "checkbox":
      return "Checkbox";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function defaultFormFields(): FormField[] {
  return [
    {
      id: "work-link",
      type: "url",
      label: "Work link",
      description: "Link to your deliverable",
      required: true,
      options: [],
    },
    {
      id: "notes",
      type: "long_text",
      label: "Notes",
      description: "Anything reviewers should know",
      required: false,
      options: [],
    },
  ];
}

export function createFormField(
  partial?: Partial<FormField> & { type?: FormFieldType },
): FormField {
  return {
    id: partial?.id ?? crypto.randomUUID(),
    type: partial?.type ?? "short_text",
    label: partial?.label ?? "Untitled question",
    description: partial?.description ?? "",
    required: partial?.required ?? false,
    options: partial?.options ?? [],
  };
}

function isFormFieldType(value: string): value is FormFieldType {
  return (formFieldTypes as readonly string[]).includes(value);
}

export function parseFormFieldsJson(raw: string): FormField[] {
  if (!raw.trim()) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Submission form fields are invalid.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Submission form fields are invalid.");
  }

  const fields: FormField[] = [];

  for (const item of parsed) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const row = item as Record<string, unknown>;
    const type = String(row.type ?? "");
    if (!isFormFieldType(type)) {
      continue;
    }

    const label = String(row.label ?? "").trim();
    if (!label) {
      continue;
    }

    const options = Array.isArray(row.options)
      ? row.options
          .map((option) => String(option).trim())
          .filter(Boolean)
      : [];

    if (type === "select" && options.length === 0) {
      throw new Error(`Dropdown "${label}" needs at least one option.`);
    }

    fields.push({
      id: String(row.id ?? crypto.randomUUID()),
      type,
      label,
      description: String(row.description ?? "").trim(),
      required: Boolean(row.required),
      options,
    });
  }

  if (fields.length === 0) {
    throw new Error("Add at least one question to the submission form.");
  }

  return fields;
}

export function collectSubmissionAnswers(
  formData: FormData,
  fields: FormField[],
): Record<string, string> {
  const answers: Record<string, string> = {};

  for (const field of fields) {
    const key = `field_${field.id}`;
    const value =
      field.type === "checkbox"
        ? formData.get(key) === "on"
          ? "yes"
          : "no"
        : String(formData.get(key) ?? "").trim();

    if (field.required && (field.type === "checkbox" ? value !== "yes" : !value)) {
      throw new Error(`"${field.label}" is required.`);
    }

    if (field.type === "url" && value) {
      try {
        void new URL(value);
      } catch {
        throw new Error(`"${field.label}" must be a valid URL.`);
      }
    }

    if (field.type === "number" && value && Number.isNaN(Number(value))) {
      throw new Error(`"${field.label}" must be a number.`);
    }

    if (
      field.type === "select" &&
      value &&
      !field.options.includes(value)
    ) {
      throw new Error(`"${field.label}" has an invalid option.`);
    }

    answers[field.id] = value;
  }

  return answers;
}

export function answerDisplayValue(value: string) {
  if (value === "yes") {
    return "Yes";
  }
  if (value === "no") {
    return "No";
  }
  return value || "—";
}
