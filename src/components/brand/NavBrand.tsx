import Link from "next/link";
import ConstellateIcon from "@/components/ConstellateIcon";

const TAGLINE = "Private Network for Intellectual Ascent";

type NavBrandProps = {
  variant?: "full" | "compact";
  className?: string;
};

export default function NavBrand({ variant = "full", className = "" }: NavBrandProps) {
  const content = (
    <>
      <ConstellateIcon className={variant === "compact" ? "h-8 w-8 shrink-0" : "h-9 w-9 shrink-0"} />
      <div className="flex flex-col justify-center">
        <span
          className="font-medium tracking-tight text-[#F4F4F2]"
          style={{
            fontSize: variant === "full" ? "1.0625rem" : "0.9375rem",
            letterSpacing: "0.02em",
          }}
        >
          Constellate
        </span>
        {variant === "full" && (
          <span className="mt-0.5 text-xs text-[rgba(244,244,242,0.6)] leading-tight">
            {TAGLINE}
          </span>
        )}
      </div>
    </>
  );

  return (
    <Link
      href="/"
      className={`flex items-center gap-3.5 text-[#F4F4F2] transition-opacity hover:opacity-90 ${className}`.trim()}
      aria-label="Constellate home"
    >
      {content}
    </Link>
  );
}
