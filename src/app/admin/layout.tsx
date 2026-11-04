import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const request = new Request("https://multani-mithas.internal/admin", {
    headers: { cookie: cookieHeader },
  });

  if (!isAdminRequest(request)) {
    redirect("/admin-login");
  }

  return <>{children}</>;
}
