import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (session) {
    if (role === "MENTOR") redirect("/dashboard/mentor");
    redirect("/dashboard/student");
  }

  return (
    <div className="min-h-screen flex flex-col bg-uatx-cream">
      <header className="bg-uatx-ink border-b border-uatx-gold/20">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <span className="font-display text-section uppercase tracking-wide text-uatx-ivory">
            Bridge
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-small text-uatx-ivory/80 hover:text-uatx-gold transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded border border-uatx-gold bg-uatx-gold px-4 py-2 text-small font-semibold uppercase tracking-wide text-uatx-ink hover:bg-uatx-gold/90 transition-colors"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <p className="font-display text-display-lg uppercase tracking-tight text-uatx-ink sm:text-3xl">
          Talent Network
        </p>
        <p className="mt-4 max-w-md text-center text-body text-uatx-sand">
          Request help from a mentor. We match you; you get a 30-minute coffee chat.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/signup"
            className="rounded border border-uatx-gold bg-uatx-gold px-6 py-3 text-small font-semibold uppercase tracking-wide text-uatx-ink hover:bg-uatx-gold/90 transition-colors"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="rounded border border-uatx-ink/20 bg-transparent px-6 py-3 text-small font-medium text-uatx-ink hover:border-uatx-gold hover:text-uatx-gold transition-colors"
          >
            Log in
          </Link>
        </div>
      </main>

      <footer className="border-t border-uatx-ink/10 py-5 text-center text-small text-uatx-sand">
        Bridge — Talent Network coffee chats
      </footer>
    </div>
  );
}
