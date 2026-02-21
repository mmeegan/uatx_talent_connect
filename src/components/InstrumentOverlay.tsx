"use client";

/**
 * Instrument overlay: very faint grid + corner crosshairs.
 * Refined, thin lines; low opacity so it feels like technical UI, not wallpaper.
 */
export default function InstrumentOverlay({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden
    >
      {/* Grid: spaced out, thin lines, ~6% opacity */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="instrument-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#instrument-grid)" />
      </svg>
      {/* Corner crosshairs: thin, refined */}
      <svg className="absolute left-0 top-0 w-10 h-10 opacity-[0.06]" viewBox="0 0 40 40">
        <line x1="0" y1="12" x2="20" y2="12" stroke="white" strokeWidth="0.25" />
        <line x1="12" y1="0" x2="12" y2="20" stroke="white" strokeWidth="0.25" />
      </svg>
      <svg className="absolute right-0 top-0 w-10 h-10 opacity-[0.06]" viewBox="0 0 40 40">
        <line x1="40" y1="12" x2="20" y2="12" stroke="white" strokeWidth="0.25" />
        <line x1="28" y1="0" x2="28" y2="20" stroke="white" strokeWidth="0.25" />
      </svg>
      <svg className="absolute left-0 bottom-0 w-10 h-10 opacity-[0.06]" viewBox="0 0 40 40">
        <line x1="0" y1="28" x2="20" y2="28" stroke="white" strokeWidth="0.25" />
        <line x1="12" y1="40" x2="12" y2="20" stroke="white" strokeWidth="0.25" />
      </svg>
      <svg className="absolute right-0 bottom-0 w-10 h-10 opacity-[0.06]" viewBox="0 0 40 40">
        <line x1="40" y1="28" x2="20" y2="28" stroke="white" strokeWidth="0.25" />
        <line x1="28" y1="40" x2="28" y2="20" stroke="white" strokeWidth="0.25" />
      </svg>
    </div>
  );
}
