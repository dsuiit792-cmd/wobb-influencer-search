import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { AddToListButton } from "./AddToListButton";
import { formatFollowers } from "@/utils/formatters";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  onProfileClick?: (username: string) => void;
}

function ProfileCardComponent({ profile, platform, onProfileClick }: ProfileCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    onProfileClick?.(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-white hover:border-violet-300 hover:shadow-md transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    >
      <img
        src={profile.picture}
        alt={`${profile.fullname}'s profile picture`}
        loading="lazy"
        className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-100"
      />
      <div className="text-left flex-1 min-w-0">
        <div className="flex items-center gap-1 font-semibold text-gray-900 truncate">
          <span className="truncate">@{profile.username}</span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-gray-600 truncate">{profile.fullname}</div>
        <div className="text-sm text-gray-400 mt-0.5">
          {formatFollowers(profile.followers)} followers
        </div>
      </div>
      <AddToListButton profile={profile} platform={platform} stopPropagation />
    </div>
  );
}

export const ProfileCard = memo(ProfileCardComponent);
