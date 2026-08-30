import { listingCategories, listingTypes } from "@/lib/db/schema";
import { categoryLabel, typeLabel } from "@/lib/format";

export function ListingFilters({
  category,
  type,
  query,
}: {
  category?: string;
  type?: string;
  query?: string;
}) {
  return (
    <form className="flex flex-col gap-3 md:flex-row md:items-end">
      <label className="flex-1 text-xs text-muted">
        Search
        <input
          name="q"
          defaultValue={query}
          placeholder="Content, design, Fiber, referrals…"
          className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none ring-accent/40 placeholder:text-muted/70 focus:ring-2"
        />
      </label>
      <label className="text-xs text-muted">
        Type
        <select
          name="type"
          defaultValue={type ?? "all"}
          className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none md:w-40"
        >
          <option value="all">All</option>
          {listingTypes.map((value) => (
            <option key={value} value={value}>
              {typeLabel(value)}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-muted">
        Category
        <select
          name="category"
          defaultValue={category ?? "all"}
          className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none md:w-44"
        >
          <option value="all">All</option>
          {listingCategories.map((value) => (
            <option key={value} value={value}>
              {categoryLabel(value)}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-[#04110b]"
      >
        Filter
      </button>
    </form>
  );
}
