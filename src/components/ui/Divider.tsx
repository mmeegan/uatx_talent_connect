export default function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px bg-[rgba(255,255,255,0.08)] ${className}`} role="presentation" />;
}
