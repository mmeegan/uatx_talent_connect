"use client";

/**
 * Procedural starfield: sparse dots at very low opacity (no glitter/neon).
 */
export default function StarfieldLayer({ className = "" }: { className?: string }) {
  const dots = Array.from({ length: 60 }, (_, i) => ({
    cx: (i * 17 + 13) % 100,
    cy: (i * 23 + 7) % 100,
    r: (i % 3) * 0.5 + 0.5,
  }));

  return (
    <svg
      className={`absolute inset-0 h-full w-full opacity-[0.12] pointer-events-none ${className}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <pattern
          id="starfield-dots"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill="white"
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#starfield-dots)" />
    </svg>
  );
}
