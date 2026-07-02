interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 text-violet-500 flex-shrink-0"
      role="img"
      aria-label="Verified account"
    >
      <path
        fillRule="evenodd"
        d="M10 1.5l2.1 1.3 2.5-.3 1 2.3 2.2 1.2-.4 2.5 1.4 2.1-1.4 2.1.4 2.5-2.2 1.2-1 2.3-2.5-.3L10 18.5l-2.1-1.3-2.5.3-1-2.3-2.2-1.2.4-2.5L1.2 10l1.4-2.1-.4-2.5 2.2-1.2 1-2.3 2.5.3L10 1.5zm3.7 6.3a.9.9 0 00-1.3-1.2L9 10l-1.4-1.4A.9.9 0 106.3 9.9l2.1 2.1a.9.9 0 001.3 0l4-4.2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
