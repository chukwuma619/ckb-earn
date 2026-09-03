import { notFound, redirect } from "next/navigation";
import { getCurrentProfile, isAdminEmail } from "@/lib/auth/session";
import { getListingById, isListingEnded } from "@/lib/listings";
import { listListingSubmissions } from "@/lib/submissions";
import { listListingAwards } from "@/lib/awards";
import { ListingForm } from "@/components/listing-form";
import { PrizeSettlement } from "@/components/prize-settlement";
import { updateSubmissionStatusAction } from "@/lib/actions";
import { answerDisplayValue } from "@/lib/forms";
import { awardStatusLabel, formatUsd, submissionStatusLabel } from "@/lib/format";
import { submissionStatuses } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, profile } = await getCurrentProfile();
  if (!user) {
    redirect("/auth/sign-in");
  }
  if (!profile?.isAdmin && !isAdminEmail(user.email)) {
    redirect("/");
  }

  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) {
    notFound();
  }

  const submissions = await listListingSubmissions(listing.id);
  const awards = listListingAwards(listing.id);
  const ended = isListingEnded(listing);

  return (
    <main className="mx-auto grid w-full max-w-[70rem] gap-10 px-3 py-6 sm:px-4 lg:grid-cols-2">
      <div className="space-y-6">
        <PrizeSettlement
          listing={listing}
          submissions={submissions}
          awards={awards}
          ended={ended}
        />
        <Card>
          <CardHeader>
            <CardTitle>Edit listing</CardTitle>
          </CardHeader>
          <CardContent>
            <ListingForm listing={listing} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {submissions.length === 0 ? (
            <p className="py-10 text-sm text-muted-foreground">No submissions yet.</p>
          ) : (
            submissions.map(({ submission, profile: talent }, index) => {
              const award =
                awards.find((row) => row.submissionId === submission.id) ?? null;

              return (
                <div key={submission.id}>
                  {index > 0 ? <Separator className="mb-4" /> : null}
                  <p className="text-sm font-semibold">{talent.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{talent.email}</p>
                  <dl className="mt-3 space-y-2">
                    {listing.formFields.map((field) => {
                      const value = submission.answers[field.id] ?? "";
                      const display = answerDisplayValue(value);
                      const isUrl =
                        field.type === "url" && /^https?:\/\//i.test(value);

                      return (
                        <div key={field.id}>
                          <dt className="text-xs font-medium text-muted-foreground">
                            {field.label}
                          </dt>
                          <dd className="mt-0.5 text-sm">
                            {isUrl ? (
                              <Button variant="link" className="h-auto p-0" asChild>
                                <a href={value} target="_blank" rel="noreferrer">
                                  {value}
                                </a>
                              </Button>
                            ) : (
                              display
                            )}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                  {award ? (
                    <p className="mt-2 text-sm font-medium">
                      {awardStatusLabel(award.status)} {formatUsd(award.amount)}
                    </p>
                  ) : null}
                  <form action={updateSubmissionStatusAction} className="mt-3">
                    <input type="hidden" name="submissionId" value={submission.id} />
                    <FieldGroup className="flex-row flex-wrap items-end gap-2">
                      <Field>
                        <FieldLabel htmlFor={`status-${submission.id}`}>
                          Review
                        </FieldLabel>
                        <NativeSelect
                          id={`status-${submission.id}`}
                          name="status"
                          defaultValue={submission.status}
                        >
                          {submissionStatuses.map((status) => (
                            <NativeSelectOption key={status} value={status}>
                              {submissionStatusLabel(status)}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      </Field>
                      <Button type="submit" variant="outline" size="sm">
                        Update
                      </Button>
                    </FieldGroup>
                  </form>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </main>
  );
}
