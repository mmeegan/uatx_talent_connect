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
    <div className="min-h-screen flex flex-col bg-cream">
      <header className="border-b border-stone-200/80 bg-cream">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <span className="font-serif text-xl text-charcoal">Bridge</span>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-charcoal/70 hover:text-charcoal"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-hover"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <p className="font-serif text-2xl tracking-tight text-charcoal sm:text-3xl">
          Talent Network
        </p>
        <p className="mt-3 max-w-md text-center text-charcoal/75">
          Request help from a mentor. We match you; you get a 30-minute coffee chat.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/signup"
            className="rounded bg-maroon px-6 py-3 text-sm font-medium text-white hover:bg-maroon-hover"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="rounded border border-charcoal/20 bg-transparent px-6 py-3 text-sm font-medium text-charcoal hover:bg-charcoal/5"
          >
            Log in
          </Link>
        </div>
      </main>

      <footer className="border-t border-stone-200/80 py-6 text-center text-sm text-charcoal/50">
        Bridge — Talent Network coffee chats
      </footer>
    </div>
  );
}
