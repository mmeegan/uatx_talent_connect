import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavBrand from "@/components/brand/NavBrand";
import Shell from "@/components/Shell";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (session) {
    if (role === "ADMIN") redirect("/admin");
    if (role === "MENTOR") redirect("/dashboard/mentor");
    redirect("/dashboard/student");
  }

  return (
    <Shell ambient instrumentOverlay drift className="min-h-screen">
      <header
        className="relative border-b bg-gradient-to-b from-[#0E131A] to-[#0B0F14]"
        style={{ minHeight: "92px", borderBottomColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="mx-auto flex h-[92px] max-w-[1100px] items-center justify-between px-8 lg:px-10">
          <NavBrand variant="full" className="shrink-0" />
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
              className="rounded-lg border border-[rgba(244,244,242,0.4)] bg-transparent px-5 py-2.5 text-sm font-medium text-[#F4F4F2] transition-colors hover:border-[#C6A75E] hover:text-[#C6A75E] focus:outline-none focus:ring-2 focus:ring-[#C6A75E] focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col">
        {/* Hero: full-bleed, poster-like */}
        <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-24">
          <h1
            className="font-display text-4xl font-bold tracking-tight text-[#F4F4F2] sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-center animate-hero-fade-in opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            Find your orientation.
          </h1>
          <p
            className="mt-8 max-w-md text-center text-lg text-[rgba(244,244,242,0.6)] leading-relaxed animate-hero-fade-in opacity-0"
            style={{ animationDelay: "0.35s" }}
          >
            Structured mentorship connecting UATX students with professionals across industries.
          </p>
          <div
            className="mt-14 flex flex-col items-center gap-4 sm:flex-row animate-hero-fade-in opacity-0"
            style={{ animationDelay: "0.5s" }}
          >
            <Link href="/login">
              <Button variant="primary" className="min-w-[200px] py-3">
                Enter Constellate
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" className="min-w-[160px] py-3">
                How it works
              </Button>
            </Link>
          </div>
          {/* Scroll cue */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[rgba(244,244,242,0.35)] animate-hero-fade-in opacity-0"
            style={{ animationDelay: "0.8s" }}
            aria-hidden
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="h-8 w-px bg-current" />
          </div>
        </section>

        {/* Editorial sections */}
        <section id="how-it-works" className="relative mx-auto w-full max-w-[880px] px-8 py-24 lg:px-10">
          <div className="space-y-24">
            <SectionHeader
              label="Process"
              title="How it works"
            >
              UATX students request mentorship; the network matches them with professionals. Connections are structured and time-bound.
            </SectionHeader>

            <div className="grid gap-12 sm:grid-cols-3">
              <div>
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#C6A75E]">01</span>
                <p className="mt-2 text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">Students submit a mentorship request.</p>
              </div>
              <div>
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#C6A75E]">02</span>
                <p className="mt-2 text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">Mentors are matched by expertise and availability.</p>
              </div>
              <div>
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#C6A75E]">03</span>
                <p className="mt-2 text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">Connections are structured and time-bound.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full max-w-[880px] mx-auto bg-[rgba(255,255,255,0.06)]" />

        <section className="relative mx-auto w-full max-w-[880px] px-8 py-24 lg:px-10">
          <SectionHeader
            label="Purpose"
            title="Why the Talent Network"
          >
            The University of Austin Talent Network supports UATX students with structured mentorship from professionals. Matches are intentional; conversations are focused and time-bound to support talent development and career clarity.
          </SectionHeader>
        </section>

        <div className="h-px w-full max-w-[880px] mx-auto bg-[rgba(255,255,255,0.06)]" />

        <section className="relative mx-auto w-full max-w-[880px] px-8 py-24 lg:px-10">
          <SectionHeader
            label="Network"
            title="The Network"
          >
            UATX students are matched with up to three mentors per request based on topic and industry. Mentors participate according to availability. When a mentor accepts, the student receives contact details to schedule a focused, time-bound conversation.
          </SectionHeader>
        </section>
      </main>
    </Shell>
  );
}
