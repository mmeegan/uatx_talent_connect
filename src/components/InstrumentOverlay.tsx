"use client";

/**
 * Instrument/UI overlay: faint grid + crosshair marks (technical, editorial).
 * Use pointer-events-none so it doesn't block interaction.
 */
export default function InstrumentOverlay({ className = "" }: { className?: string }) {
  const crosshairSize = 24;
  const crosshairOffset = 32;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden
    >
      {/* Grid */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="instrument-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#instrument-grid)" />
      </svg>
      {/* Crosshairs at corners */}
      <svg
        className="absolute left-0 top-0 w-12 h-12 opacity-[0.08]"
        viewBox="0 0 48 48"
      >
        <line x1="0" y1="16" x2="24" y2="16" stroke="white" strokeWidth="0.5" />
        <line x1="16" y1="0" x2="16" y2="24" stroke="white" strokeWidth="0.5" />
      </svg>
      <svg
        className="absolute right-0 top-0 w-12 h-12 opacity-[0.08]"
        viewBox="0 0 48 48"
      >
        <line x1="48" y1="16" x2="24" y2="16" stroke="white" strokeWidth="0.5" />
        <line x1="32" y1="0" x2="32" y2="24" stroke="white" strokeWidth="0.5" />
      </svg>
      <svg
        className="absolute left-0 bottom-0 w-12 h-12 opacity-[0.08]"
        viewBox="0 0 48 48"
      >
        <line x1="0" y1="32" x2="24" y2="32" stroke="white" strokeWidth="0.5" />
        <line x1="16" y1="48" x2="16" y2="24" stroke="white" strokeWidth="0.5" />
      </svg>
      <svg
        className="absolute right-0 bottom-0 w-12 h-12 opacity-[0.08]"
        viewBox="0 0 48 48"
      >
        <line x1="48" y1="32" x2="24" y2="32" stroke="white" strokeWidth="0.5" />
        <line x1="32" y1="48" x2="32" y2="24" stroke="white" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
