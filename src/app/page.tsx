import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ConstellateIcon from "@/components/ConstellateIcon";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (session) {
    if (role === "ADMIN") redirect("/admin");
    if (role === "MENTOR") redirect("/dashboard/mentor");
    redirect("/dashboard/student");
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B0F14]">
      <div className="radial-bg absolute inset-0 pointer-events-none" aria-hidden />
      <header className="border-b border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[#0E131A] to-[#0B0F14]">
        <div className="mx-auto flex h-[92px] max-w-[1100px] items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-[#F4F4F2] transition-opacity hover:opacity-90"
            aria-label="Constellate"
          >
            <ConstellateIcon className="h-9 w-9" />
          </Link>
          <nav className="flex items-center gap-8">
            <Link
              href="/login"
              className="group relative text-sm font-medium text-[rgba(244,244,242,0.6)] transition-colors hover:text-[#F4F4F2]"
            >
              Log in
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C6A75E] transition-all duration-200 group-hover:w-full" aria-hidden />
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-[rgba(244,244,242,0.4)] bg-transparent px-5 py-2.5 text-sm font-medium text-[#F4F4F2] transition-colors duration-200 hover:border-[#C6A75E] hover:text-[#C6A75E] focus:outline-none focus:ring-2 focus:ring-[#C6A75E] focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-24">
        <h1 className="font-display text-4xl font-bold tracking-tight text-[#F4F4F2] sm:text-5xl md:text-6xl leading-tight">
          Find Your Orientation.
        </h1>
        <p className="mt-8 max-w-md text-center text-lg text-[rgba(244,244,242,0.6)] leading-relaxed">
          Constellate matches you with mentors who sharpen your direction.
        </p>
        <Link
          href="/login"
          className="mt-12 inline-block w-full max-w-xs rounded-lg border border-[rgba(244,244,242,0.4)] bg-transparent py-3.5 text-center text-base font-medium text-[#F4F4F2] transition-colors duration-200 hover:border-[#C6A75E] hover:text-[#C6A75E] focus:outline-none focus:ring-2 focus:ring-[#C6A75E] focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
        >
          Enter Constellate
        </Link>
      </main>

      <section className="relative mx-auto max-w-[880px] px-6 py-20">
        <div className="space-y-20">
          <div>
            <h2 className="font-display text-xl font-medium text-[#F4F4F2]">How it works</h2>
            <div className="mt-3 h-px w-12 bg-[#C6A75E]" />
            <p className="mt-4 text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">
              Submit a request. We match you with up to three mentors. When one accepts, you receive their contact to schedule a focused conversation.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-medium text-[#F4F4F2]">Why it exists</h2>
            <div className="mt-3 h-px w-12 bg-[#C6A75E]" />
            <p className="mt-4 text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">
              A private network for clarity. Structured guidance from people who have been where you&apos;re going.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-medium text-[#F4F4F2]">Enter Constellate</h2>
            <div className="mt-3 h-px w-12 bg-[#C6A75E]" />
            <p className="mt-4 text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">
              By invitation or application. If you have access, sign up and submit your first request.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
