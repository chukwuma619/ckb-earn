import Link from "next/link";
import { listingCategories, listingTypes, listingPriorities } from "@/lib/db/schema";
import { categoryLabel, priorityLabel } from "@/lib/format";

function hrefFor(next: { type?: string; category?: string; priority?: string; q?: string }) {
  const params = new URLSearchParams();
  if (next.type && next.type !== "all") {
    params.set("type", next.type);
  }
  if (next.category && next.category !== "all") {
    params.set("category", next.category);
  }
  if (next.priority && next.priority !== "all") {
    params.set("priority", next.priority);
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
      className={`relative inline-flex items-center px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? "text-black after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-full after:bg-[#14E082]"
          : "text-slate-500 hover:text-black"
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
      className={`rounded-full border px-3.5 py-0.5 text-[0.8rem] whitespace-nowrap sm:text-sm transition-colors ${
        active
          ? "border-black bg-black text-[#14E082] font-medium"
          : "border-slate-200 text-slate-500 hover:border-black hover:bg-black/5 hover:text-black"
      }`}
    >
      {children}
    </Link>
  );
}

export function ListingFilters({
  category,
  type,
  priority,
  query,
}: {
  category?: string;
  type?: string;
  priority?: string;
  query?: string;
}) {
  const currentType = type ?? "all";
  const currentCategory = category ?? "all";
  const currentPriority = priority ?? "all";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Tab
            href={hrefFor({ category: currentCategory, priority: currentPriority, q: query })}
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
                priority: currentPriority,
                q: query,
              })}
              active={currentType === value}
            >
              {value === "bounty" ? "Bounties" : value === "grant" ? "Grants" : value === "permanent" ? "Permanent" : "Spark"}
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
          {currentPriority !== "all" ? (
            <input type="hidden" name="priority" value={currentPriority} />
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
          href={hrefFor({ type: currentType, priority: currentPriority, q: query })}
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
              priority: currentPriority,
              q: query,
            })}
            active={currentCategory === value}
          >
            {categoryLabel(value)}
          </Pill>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Pill
          href={hrefFor({ type: currentType, category: currentCategory, q: query })}
          active={currentPriority === "all"}
        >
          All Priorities
        </Pill>
        {listingPriorities.map((value) => (
          <Pill
            key={value}
            href={hrefFor({
              type: currentType,
              category: currentCategory,
              priority: value,
              q: query,
            })}
            active={currentPriority === value}
          >
            {priorityLabel(value)}
          </Pill>
        ))}
      </div>
    </div>
  );
}
