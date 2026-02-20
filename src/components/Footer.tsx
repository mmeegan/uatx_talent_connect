import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex h-[72px] items-center justify-between border-t border-[rgba(255,255,255,0.08)] px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-[1100px] w-full items-center justify-between">
        <span className="text-sm text-[rgba(244,244,242,0.4)]">
          Constellate © {new Date().getFullYear()}
        </span>
        <nav className="flex items-center gap-6" aria-label="Footer">
          <Link
            href="/privacy"
            className="text-sm text-[rgba(244,244,242,0.4)] transition-colors duration-200 hover:text-[rgba(244,244,242,0.6)]"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-[rgba(244,244,242,0.4)] transition-colors duration-200 hover:text-[rgba(244,244,242,0.6)]"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
