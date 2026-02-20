import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function MatchesRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role === "ADMIN") redirect("/admin");
  redirect("/dashboard/student");
}
