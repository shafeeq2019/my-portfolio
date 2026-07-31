import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Require an authenticated admin; redirect to login otherwise. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const role = session.user.role ?? "ADMIN";
  if (role !== "ADMIN" && role !== "EDITOR") redirect("/admin/login");
  return session;
}
