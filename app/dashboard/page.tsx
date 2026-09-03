import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { listUserSubmissions } from "@/lib/submissions";
import { submissionStatusLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user } = await getCurrentProfile();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const rows = await listUserSubmissions(user.id);

  return (
    <main className="mx-auto w-full max-w-[70rem] px-3 py-6 sm:px-4">
      <h1 className="text-xl font-semibold">Your Submissions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Track status and payouts from one place.
      </p>
      <div className="mt-6">
        {rows.length === 0 ? (
          <Empty className="border border-dashed py-16">
            <EmptyHeader>
              <EmptyTitle>No submissions yet</EmptyTitle>
              <EmptyDescription>Browse listings and submit your work.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/">Browse listings</Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ submission, listing }) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <Button variant="link" className="h-auto p-0" asChild>
                      <Link href={`/bounties/${listing.slug}`}>{listing.title}</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {submission.createdAt.toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {submissionStatusLabel(submission.status)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {listing.rewardAmount.toLocaleString()}{" "}
                    <span className="text-muted-foreground">USD</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
}
