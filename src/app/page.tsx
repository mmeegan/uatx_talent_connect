import Link from "next/link";
import { redirect } from "next/navigation";
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
    <div className="min-h-screen flex flex-col bg-[#0B0F14]">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6 lg:px-8">
          <span className="font-display text-xl tracking-tight text-zinc-100">
            Constellate
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-200"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl md:text-6xl">
          Find your orientation.
        </h1>
        <p className="mt-6 max-w-md text-center text-lg text-zinc-400 leading-relaxed">
          Constellate matches you with mentors who sharpen your direction.
        </p>
        <Link
          href="/login"
          className="mt-10 inline-block w-full max-w-xs rounded-lg border border-zinc-200 bg-zinc-100 py-3.5 text-center text-base font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
        >
          Enter Constellate
        </Link>
      </main>

      <footer className="border-t border-zinc-800 py-12">
        <div className="mx-auto max-w-[880px] space-y-12 px-6">
          <div className="h-px bg-zinc-800" />
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                How it works
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Submit a request. We match you with up to three mentors. When one accepts, you receive their contact to schedule a focused conversation.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Why it exists
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                A private network for clarity. Structured guidance from people who have been where you’re going.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Join
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                By invitation or application. If you have access, sign up and submit your first request.
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-zinc-500">
            Constellate — a private intellectual network
          </p>
        </div>
      </footer>
    </div>
  );
}
