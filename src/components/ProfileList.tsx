import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  onProfileClick: (username: string) => void;
}

export function ProfileList({ profiles, platform, onProfileClick }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 text-gray-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-12 h-12 mb-3 text-gray-300" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
        </svg>
        <p className="text-sm">No profiles found</p>
        <p className="text-xs mt-1">Try a different search term or platform.</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Search results">
      {profiles.map((profile) => (
        <li key={profile.user_id}>
          <ProfileCard
            profile={profile}
            platform={platform}
            onProfileClick={onProfileClick}
          />
        </li>
      ))}
    </ul>
  );
}
