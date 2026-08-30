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

function SidebarLink({
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
      className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-accent/10 text-accent"
          : "text-muted hover:bg-surface-hover hover:text-foreground"
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
    <div className="space-y-8">
      {/* Search Section */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
          Search
        </h3>
        <form className="relative">
          {currentType !== "all" && <input type="hidden" name="type" value={currentType} />}
          {currentCategory !== "all" && <input type="hidden" name="category" value={currentCategory} />}
          {currentPriority !== "all" && <input type="hidden" name="priority" value={currentPriority} />}
          <input
            name="q"
            defaultValue={query}
            placeholder="Keywords..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </form>
      </div>

      {/* Program Type Section */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
          Program Type
        </h3>
        <div className="flex flex-col gap-1">
          <SidebarLink
            href={hrefFor({ category: currentCategory, priority: currentPriority, q: query })}
            active={currentType === "all"}
          >
            All Programs
          </SidebarLink>
          {listingTypes.map((value) => (
            <SidebarLink
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
            </SidebarLink>
          ))}
        </div>
      </div>

      {/* Tracks Section */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
          Pathways
        </h3>
        <div className="flex flex-col gap-1">
          <SidebarLink
            href={hrefFor({ type: currentType, priority: currentPriority, q: query })}
            active={currentCategory === "all"}
          >
            All Pathways
          </SidebarLink>
          {listingCategories.map((value) => (
            <SidebarLink
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
            </SidebarLink>
          ))}
        </div>
      </div>

      {/* Priorities Section */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
          Priority
        </h3>
        <div className="flex flex-col gap-1">
          <SidebarLink
            href={hrefFor({ type: currentType, category: currentCategory, q: query })}
            active={currentPriority === "all"}
          >
            All Priorities
          </SidebarLink>
          {listingPriorities.map((value) => (
            <SidebarLink
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
            </SidebarLink>
          ))}
        </div>
      </div>
    </div>
  );
}
