"use client";

import { type ReactNode } from "react";
import AmbientBackground from "@/components/AmbientBackground";
import InstrumentOverlay from "@/components/InstrumentOverlay";

type ShellProps = {
  children: ReactNode;
  /** Apply ambient background layers (radial, optional gold bloom, noise, vignette) */
  ambient?: boolean;
  /** Apply instrument overlay (grid + crosshairs). Use on landing for poster feel. */
  instrumentOverlay?: boolean;
  /** Slight drift on ambient layer */
  drift?: boolean;
  className?: string;
};

export default function Shell({
  children,
  ambient = true,
  instrumentOverlay = false,
  drift = false,
  className = "",
}: ShellProps) {
  return (
    <div className={`relative min-h-full flex flex-col ${className}`}>
      {ambient && (
        <AmbientBackground
          goldBloom={ambient}
          noise={ambient}
          vignette={ambient}
          drift={drift}
          className="absolute inset-0"
        />
      )}
      {instrumentOverlay && <InstrumentOverlay className="absolute inset-0" />}
      <div className="relative flex flex-col flex-1">{children}</div>
    </div>
  );
}
