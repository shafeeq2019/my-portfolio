import { requireAdmin } from "@/lib/require-admin";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return <AdminShell user={session.user}>{children}</AdminShell>;
}
