import { useShortlistStore } from "@/store/useShortlistStore";
import type { Platform, UserProfileSummary } from "@/types";
import { clsx } from "clsx";

interface AddToListButtonProps {
  profile: UserProfileSummary;
  platform: Platform;
  size?: "sm" | "md";
  className?: string;
  /** Stop the click from bubbling to a parent (e.g. a clickable card row). */
  stopPropagation?: boolean;
}

export function AddToListButton({
  profile,
  platform,
  size = "sm",
  className,
  stopPropagation = false,
}: AddToListButtonProps) {
  const isShortlisted = useShortlistStore((s) => s.isShortlisted(profile.user_id));
  const toggleProfile = useShortlistStore((s) => s.toggleProfile);

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    toggleProfile(profile, platform);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isShortlisted}
      aria-label={
        isShortlisted
          ? `Remove ${profile.fullname} from shortlist`
          : `Add ${profile.fullname} to shortlist`
      }
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors duration-150 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        isShortlisted
          ? "bg-violet-600 text-white hover:bg-violet-700"
          : "bg-white text-gray-700 border border-gray-300 hover:border-violet-400 hover:text-violet-700",
        className
      )}
    >
      <svg
        viewBox="0 0 20 20"
        fill={isShortlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.6}
        className="w-3.5 h-3.5"
        aria-hidden="true"
      >
        {isShortlisted ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 10.5l4 4 8-9"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 4v12M4 10h12"
          />
        )}
      </svg>
      {isShortlisted ? "Shortlisted" : "Add to List"}
    </button>
  );
}
