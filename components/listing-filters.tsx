import Link from "next/link";
import { listingCategories, listingTypes } from "@/lib/types";
import { categoryLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

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
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className="w-full justify-start"
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
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
    <FieldGroup className="gap-8">
      <Field>
        <FieldLabel>Search</FieldLabel>
        <form>
          {currentType !== "all" && <input type="hidden" name="type" value={currentType} />}
          {currentCategory !== "all" && (
            <input type="hidden" name="category" value={currentCategory} />
          )}
          <Input name="q" defaultValue={query} placeholder="Keywords..." />
        </form>
      </Field>

      <Field>
        <FieldLabel>Program Type</FieldLabel>
        <div className="flex flex-col gap-1">
          <SidebarLink
            href={hrefFor({ category: currentCategory, q: query })}
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
                q: query,
              })}
              active={currentType === value}
            >
              {value === "bounty" ? "Bounties" : "Grants"}
            </SidebarLink>
          ))}
        </div>
      </Field>

      <Field>
        <FieldLabel>Pathways</FieldLabel>
        <div className="flex flex-col gap-1">
          <SidebarLink
            href={hrefFor({ type: currentType, q: query })}
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
                q: query,
              })}
              active={currentCategory === value}
            >
              {categoryLabel(value)}
            </SidebarLink>
          ))}
        </div>
      </Field>
    </FieldGroup>
  );
}
