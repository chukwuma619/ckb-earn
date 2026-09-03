import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { updateProfileAction } from "@/lib/actions";
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
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { user, profile } = await getCurrentProfile();
  if (!user || !profile) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Reviewers use this to pay you in CKB after you win.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfileAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Display name</FieldLabel>
                <Input id="name" name="name" defaultValue={profile.name} />
              </Field>
              <Field>
                <FieldLabel htmlFor="ckbAddress">CKB address</FieldLabel>
                <Input
                  id="ckbAddress"
                  name="ckbAddress"
                  defaultValue={profile.ckbAddress}
                  placeholder="ckt1… or ckb1…"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="twitter">X / Twitter</FieldLabel>
                <Input
                  id="twitter"
                  name="twitter"
                  defaultValue={profile.twitter}
                  placeholder="@handle"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="skills">Skills</FieldLabel>
                <Input
                  id="skills"
                  name="skills"
                  defaultValue={profile.skills}
                  placeholder="Writing, design, Rust, Fiber"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Textarea id="bio" name="bio" rows={5} defaultValue={profile.bio} />
              </Field>
              <Button type="submit">Save</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
