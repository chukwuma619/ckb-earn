import Link from "next/link";
import { listingCategories, listingTypes } from "@/lib/db/schema";
import { categoryLabel, typeLabel } from "@/lib/format";

function hrefFor(next: { type?: string; category?: string; q?: string }) {
  const params = new URLSearchParams();
  if (next.type && next.type !== "all") {
    params.set("type", next.type);
  }
  if (next.category && next.category !== "all") {
    params.set("category", next.category);
  }
  if (next.q) {
    params.set("q", next.q);
  }
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function Tab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative inline-flex items-center px-2 py-1 text-sm font-medium whitespace-nowrap ${
        active
          ? "text-pill after:absolute after:bottom-[-6px] after:left-0 after:h-px after:w-full after:bg-pill"
          : "text-slate-500 hover:text-pill"
      }`}
    >
      {children}
    </Link>
  );
}

function Pill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3.5 py-0.5 text-[0.8rem] whitespace-nowrap sm:text-sm ${
        active
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-slate-200 text-slate-500 hover:bg-emerald-50 hover:text-slate-700"
      }`}
    >
      {children}
    </Link>
  );
}

export function ListingFilters({
  category,
  type,
  query,
}: {
  category?: string;
  type?: string;
  query?: string;
}) {
  const currentType = type ?? "all";
  const currentCategory = category ?? "all";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Tab
            href={hrefFor({ category: currentCategory, q: query })}
            active={currentType === "all"}
          >
            All
          </Tab>
          {listingTypes.map((value) => (
            <Tab
              key={value}
              href={hrefFor({
                type: value,
                category: currentCategory,
                q: query,
              })}
              active={currentType === value}
            >
              {value === "bounty" ? "Bounties" : "Projects"}
            </Tab>
          ))}
        </div>
        <form>
          {currentType !== "all" ? (
            <input type="hidden" name="type" value={currentType} />
          ) : null}
          {currentCategory !== "all" ? (
            <input type="hidden" name="category" value={currentCategory} />
          ) : null}
          <input
            name="q"
            defaultValue={query}
            placeholder="Search"
            className="h-8 w-36 rounded-md border border-slate-200 px-2.5 text-sm text-slate-600 outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
        </form>
      </div>
      <div className="flex flex-wrap gap-2">
        <Pill
          href={hrefFor({ type: currentType, q: query })}
          active={currentCategory === "all"}
        >
          All
        </Pill>
        {listingCategories.map((value) => (
          <Pill
            key={value}
            href={hrefFor({
              type: currentType,
              category: value,
              q: query,
            })}
            active={currentCategory === value}
          >
            {categoryLabel(value)}
          </Pill>
        ))}
      </div>
    </div>
  );
}
