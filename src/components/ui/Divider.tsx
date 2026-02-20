export default function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px bg-zinc-800 ${className}`} role="presentation" />;
}
