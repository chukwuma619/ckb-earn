import Link from "next/link";
import { notFound } from "next/navigation";
import { submitToListingAction } from "@/lib/actions";
import { getCurrentProfile } from "@/lib/auth/session";
import { countSubmissions, getListingBySlug } from "@/lib/listings";
import { getUserSubmission } from "@/lib/submissions";
import {
  categoryLabel,
  formatDeadline,
  formatUsd,
  statusLabel,
  submissionStatusLabel,
  typeLabel,
} from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function BountyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) {
    notFound();
  }

  const { user } = await getCurrentProfile();
  const [submissions, existing] = await Promise.all([
    countSubmissions(listing.id),
    user ? getUserSubmission(listing.id, user.id) : Promise.resolve(null),
  ]);
  const open = listing.status === "open";

  return (
    <main className="mx-auto grid w-full max-w-[70rem] gap-8 px-3 py-6 sm:px-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <article>
        <div className="flex items-start gap-4">
          <Avatar size="lg" className="size-16 rounded-md after:rounded-md">
            <AvatarFallback className="rounded-md text-sm font-semibold">CR</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">{listing.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              CKB Rewards · {typeLabel(listing.type)} ·{" "}
              {categoryLabel(listing.category)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{statusLabel(listing.status)}</Badge>
              <span className="text-xs text-muted-foreground">
                {formatDeadline(listing.deadline)} · {submissions} submission
                {submissions === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="whitespace-pre-wrap text-sm leading-7">{listing.description}</div>
        {listing.requirements ? (
          <section className="mt-8">
            <h2 className="text-sm font-semibold">Skills Needed</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {listing.requirements}
            </p>
          </section>
        ) : null}
      </article>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardDescription>Prize</CardDescription>
            <CardTitle className="text-2xl">
              {listing.rewardUsd.toLocaleString()}{" "}
              <span className="text-base font-medium text-muted-foreground">USD</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{listing.rewardLabel}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {listing.winnerCount} winner{listing.winnerCount === 1 ? "" : "s"} ·{" "}
              {formatUsd(listing.rewardUsd)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Submit</CardTitle>
          </CardHeader>
          <CardContent>
            {!user ? (
              <p className="text-sm leading-6 text-muted-foreground">
                <Button variant="link" className="h-auto p-0" asChild>
                  <Link href="/auth/sign-in">Login</Link>
                </Button>{" "}
                to submit. Add your CKB address on your profile before payout.
              </p>
            ) : !open ? (
              <p className="text-sm text-muted-foreground">
                This listing is no longer accepting submissions.
              </p>
            ) : (
              <form action={submitToListingAction}>
                <input type="hidden" name="listingId" value={listing.id} />
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="link">Work link</FieldLabel>
                    <Input
                      id="link"
                      name="link"
                      required
                      defaultValue={existing?.link}
                      placeholder="https://"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="notes">Notes</FieldLabel>
                    <Textarea id="notes" name="notes" rows={4} defaultValue={existing?.notes} />
                  </Field>
                  <Button type="submit">{existing ? "Update submission" : "Submit"}</Button>
                  {existing ? (
                    <p className="text-xs text-muted-foreground">
                      {submissionStatusLabel(existing.status)}
                    </p>
                  ) : null}
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
