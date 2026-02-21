import NavBrand from "@/components/brand/NavBrand";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#0B0F14]">
      <div className="radial-bg absolute inset-0 pointer-events-none" aria-hidden />
      <header
        className="border-b bg-gradient-to-b from-[#0E131A] to-[#0B0F14]"
        style={{ borderBottomColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="mx-auto flex h-[92px] max-w-[1100px] items-center justify-between px-8 lg:px-10">
          <NavBrand variant="full" className="shrink-0" />
        </div>
      </header>
      <main className="relative mx-auto max-w-[680px] px-6 py-16">
        <h1 className="font-display text-4xl font-bold tracking-tight text-[#F4F4F2]">Terms</h1>
        <div className="mt-4 h-px w-16 bg-[#C6A75E]" />
        <p className="mt-6 text-[rgba(244,244,242,0.6)] leading-relaxed">
          Terms of service content goes here.
        </p>
      </main>
    </div>
  );
}
