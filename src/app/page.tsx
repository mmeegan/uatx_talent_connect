import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <span className="text-xl font-semibold text-stone-800">Bridge</span>
          <nav className="flex items-center gap-4">
            {session ? (
              <>
                {role === "STUDENT" && (
                  <Link
                    href="/dashboard/student"
                    className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
                  >
                    Dashboard
                  </Link>
                )}
                {role === "MENTOR" && (
                  <Link
                    href="/dashboard/mentor"
                    className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/api/auth/signout"
                  className="text-sm text-stone-600 hover:text-stone-900"
                >
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-stone-600 hover:text-stone-900"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Find the right mentor for your question
        </h1>
        <p className="mt-4 max-w-xl text-center text-lg text-stone-600">
          Submit a short help request. We match you with mentors by topic and availability. 
          Request a 30-minute coffee chat — no in-app messaging, just a direct connection.
        </p>
        {!session && (
          <div className="mt-10 flex gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-stone-900 px-6 py-3 text-base font-medium text-white hover:bg-stone-800"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-stone-300 bg-white px-6 py-3 text-base font-medium text-stone-700 hover:bg-stone-50"
            >
              Log in
            </Link>
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
        Bridge — Talent Network coffee chats
      </footer>
    </div>
  );
}
