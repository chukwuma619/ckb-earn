import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile, isAdminEmail } from "@/lib/auth/session";
import { listAdminListings } from "@/lib/listings";
import { statusLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user) {
    redirect("/auth/sign-in");
  }
  if (!profile?.isAdmin && !isAdminEmail(user.email)) {
    redirect("/");
  }

  const rows = await listAdminListings();

  return (
    <main className="mx-auto w-full max-w-[70rem] px-3 py-6 sm:px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Listings</h1>
        <Button asChild>
          <Link href="/admin/bounties/new">New listing</Link>
        </Button>
      </div>
      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Reward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>
                  <Button variant="link" className="h-auto p-0" asChild>
                    <Link href={`/admin/bounties/${listing.id}`}>{listing.title}</Link>
                  </Button>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {statusLabel(listing.status)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {listing.rewardUsd.toLocaleString()}{" "}
                  <span className="text-muted-foreground">USD</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
