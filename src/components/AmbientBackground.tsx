"use client";

import { type ReactNode } from "react";

type AmbientBackgroundProps = {
  children?: ReactNode;
  /** Include warm gold bloom layer */
  goldBloom?: boolean;
  /** Include subtle noise overlay */
  noise?: boolean;
  /** Include vignette (dark edges) */
  vignette?: boolean;
  /** Optional drift animation on gradient layer */
  drift?: boolean;
  className?: string;
};

export default function AmbientBackground({
  children,
  goldBloom = true,
  noise = true,
  vignette = true,
  drift = false,
  className = "",
}: AmbientBackgroundProps) {
  return (
    <div className={`relative min-h-full w-full ${className}`}>
      {/* Base radial light */}
      <div
        className={`absolute inset-0 pointer-events-none ${drift ? "animate-ambient-drift" : ""}`}
        style={{
          background: "radial-gradient(circle at 50% 15%, rgba(255,255,255,0.06), transparent 55%)",
        }}
        aria-hidden
      />
      {/* Optional warm gold bloom */}
      {goldBloom && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 70% 10%, rgba(198,167,94,0.08), transparent 45%)",
          }}
          aria-hidden
        />
      )}
      {/* Noise */}
      {noise && <div className="ambient-noise absolute inset-0 pointer-events-none" aria-hidden />}
      {/* Vignette */}
      {vignette && <div className="ambient-vignette absolute inset-0 pointer-events-none" aria-hidden />}
      {children}
    </div>
  );
}
