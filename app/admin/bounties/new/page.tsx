import { redirect } from "next/navigation";
import { getCurrentProfile, isAdminEmail } from "@/lib/auth/session";
import { ListingForm } from "@/components/listing-form";

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
      <h1 className="text-xl font-semibold text-slate-800">New listing</h1>
      <div className="mt-6">
        <ListingForm />
      </div>
    </main>
  );
}
