import Link from "next/link";
import { listingTypes } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

function hrefFor(next: { type?: string; q?: string }) {
  const params = new URLSearchParams();
  if (next.type && next.type !== "all") {
    params.set("type", next.type);
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
  type,
  query,
}: {
  type?: string;
  query?: string;
}) {
  const currentType = type ?? "all";

  return (
    <FieldGroup className="gap-8">
      <Field>
        <FieldLabel>Search</FieldLabel>
        <form>
          {currentType !== "all" && <input type="hidden" name="type" value={currentType} />}
          <Input name="q" defaultValue={query} placeholder="Keywords..." />
        </form>
      </Field>

      <Field>
        <FieldLabel>Program Type</FieldLabel>
        <div className="flex flex-col gap-1">
          <SidebarLink href={hrefFor({ q: query })} active={currentType === "all"}>
            All Programs
          </SidebarLink>
          {listingTypes.map((value) => (
            <SidebarLink
              key={value}
              href={hrefFor({ type: value, q: query })}
              active={currentType === value}
            >
              {value === "bounty" ? "Bounties" : "Grants"}
            </SidebarLink>
          ))}
        </div>
      </Field>
    </FieldGroup>
  );
}
