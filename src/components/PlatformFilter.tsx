import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { clsx } from "clsx";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
      <div
        role="tablist"
        aria-label="Filter by platform"
        className="inline-flex p-1 bg-gray-100 rounded-full self-start"
      >
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={selected === p}
            onClick={() => onChange(p)}
            className={clsx(
              "px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              selected === p
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {getPlatformLabel(p)}
          </button>
        ))}
      </div>

      <div className="relative flex-1 max-w-sm">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="6" />
          <path strokeLinecap="round" d="M17 17l-3.5-3.5" />
        </svg>
        <label htmlFor="profile-search" className="sr-only">
          Search by username or name
        </label>
        <input
          id="profile-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name..."
          className="w-full border border-gray-200 bg-white pl-9 pr-3 py-2 rounded-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        />
      </div>
    </div>
  );
}
