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
    <form action={saveListing} className="space-y-4">
      {listing ? <input type="hidden" name="id" value={listing.id} /> : null}
      <label className="block text-xs font-medium text-slate-500">
        Title
        <input
          name="title"
          required
          defaultValue={listing?.title}
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
      </label>
      <label className="block text-xs font-medium text-slate-500">
        Description
        <textarea
          name="description"
          required
          rows={6}
          defaultValue={listing?.description}
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
      </label>
      <label className="block text-xs font-medium text-slate-500">
        What to submit
        <textarea
          name="requirements"
          rows={3}
          defaultValue={listing?.requirements}
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-medium text-slate-500">
          Type
          <select
            name="type"
            defaultValue={listing?.type ?? "bounty"}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            {listingTypes.map((value) => (
              <option key={value} value={value}>
                {typeLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-slate-500">
          Category
          <select
            name="category"
            defaultValue={listing?.category ?? "content"}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            {listingCategories.map((value) => (
              <option key={value} value={value}>
                {categoryLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-slate-500">
          Status
          <select
            name="status"
            defaultValue={listing?.status ?? "open"}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            {listingStatuses.map((value) => (
              <option key={value} value={value}>
                {statusLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-slate-500">
          Priority
          <select
            name="priority"
            defaultValue={listing?.priority ?? "medium"}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            {listingPriorities.map((value) => (
              <option key={value} value={value}>
                {priorityLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-slate-500">
          Reward USD
          <input
            name="rewardUsd"
            type="number"
            min="0"
            defaultValue={listing?.rewardUsd ?? 100}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-medium text-slate-500">
          Reward label
          <input
            name="rewardLabel"
            defaultValue={listing?.rewardLabel ?? "$100 in CKB"}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-medium text-slate-500">
          Winners
          <input
            name="winnerCount"
            type="number"
            min="1"
            defaultValue={listing?.winnerCount ?? 1}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-medium text-slate-500">
          Deadline
          <input
            name="deadline"
            type="datetime-local"
            defaultValue={deadlineValue(listing?.deadline ?? null)}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <label className="block text-xs font-medium text-slate-500">
        Tags
        <input
          name="tags"
          defaultValue={listing?.tags.join(", ")}
          placeholder="writing, fiber"
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        className="btn rounded-md bg-brand px-4 py-2 text-sm font-medium text-white"
      >
        {listing ? "Save listing" : "Publish listing"}
      </button>
    </form>
  );
}
