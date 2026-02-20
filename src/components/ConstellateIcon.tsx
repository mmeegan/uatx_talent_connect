export default function ConstellateIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Minimal constellation mark: three points with subtle connections */}
      <circle cx="16" cy="8" r="2" fill="#F4F4F2" />
      <circle cx="10" cy="20" r="1.5" fill="rgba(244,244,242,0.8)" />
      <circle cx="22" cy="20" r="1.5" fill="rgba(244,244,242,0.8)" />
      <path d="M16 10v8M16 18l-6 2M16 18l6 2" stroke="rgba(244,244,242,0.25)" strokeWidth="0.75" strokeLinecap="round" />
    </svg>
  );
}
