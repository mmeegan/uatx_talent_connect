import { type ReactNode } from "react";

export default function Card({
  children,
  className = "",
  ...props
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm sm:p-8 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
