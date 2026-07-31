import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getProfile } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  const brand = profile?.fullName?.split(" ")[0] ?? "Portfolio";

  return (
    <div className="flex min-h-full flex-col">
      <Navbar brand={brand} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
