import { redirect } from "next/navigation";
import { getCurrentProfile, isAdminEmail } from "@/lib/auth/session";
import { ListingForm } from "@/components/listing-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user) {
    redirect("/auth/sign-in");
  }
  if (!profile?.isAdmin && !isAdminEmail(user.email)) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>New listing</CardTitle>
        </CardHeader>
        <CardContent>
          <ListingForm />
        </CardContent>
      </Card>
    </main>
  );
}
