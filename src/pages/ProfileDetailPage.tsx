import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { AddToListButton } from "@/components/AddToListButton";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="border border-gray-200 bg-white rounded-xl p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-semibold text-gray-900 mt-0.5">{value}</div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") as Platform) || "instagram";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    username ? "loading" : "error"
  );

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    loadProfileByUsername(username)
      .then((data) => {
        if (cancelled) return;
        setProfileData(data);
        setStatus(data ? "loaded" : "error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <p>Invalid profile</p>
        <Link to="/" className="text-violet-600 underline">Back</Link>
      </Layout>
    );
  }

  if (status === "loading") {
    return (
      <Layout title={`@${username}`}>
        <div role="status" aria-live="polite" className="text-gray-400 text-sm">
          Loading profile…
        </div>
      </Layout>
    );
  }

  if (status === "error" || !profileData) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-red-600 mb-4 text-sm">
          Could not load profile details for {username}.
        </p>
        <Link to="/" className="text-violet-600 underline text-sm">
          ← Back to search
        </Link>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  return (
    <Layout>
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 mb-6">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-3.5 h-3.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 13L5 8l5-5" />
        </svg>
        Back to search
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <img
            src={user.picture}
            alt={`${user.fullname}'s profile picture`}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-1 ring-gray-100 flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-left">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1.5 flex-wrap">
              @{user.username}
              <VerifiedBadge verified={user.is_verified} />
            </h1>
            <p className="text-gray-600">{user.fullname}</p>
            <p className="text-xs text-gray-400 mt-1 capitalize">Platform: {platform}</p>

            {user.description && (
              <p className="mt-3 text-sm text-gray-700">{user.description}</p>
            )}

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <AddToListButton profile={user} platform={platform} size="md" />
              {user.url && (
                <a
                  href={user.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 text-sm hover:text-violet-700 inline-flex items-center gap-1"
                >
                  View on platform
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-3.5 h-3.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h6v6M12 4L4 12" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <Stat label="Followers" value={formatFollowers(user.followers)} />
          <Stat label="Engagement Rate" value={formatEngagementRate(user.engagement_rate)} />
          {user.posts_count !== undefined && (
            <Stat label="Posts" value={String(user.posts_count)} />
          )}
          {user.avg_likes !== undefined && (
            <Stat label="Avg Likes" value={formatFollowers(user.avg_likes)} />
          )}
          {user.avg_comments !== undefined && (
            <Stat label="Avg Comments" value={String(user.avg_comments)} />
          )}
          {user.avg_views !== undefined && user.avg_views > 0 && (
            <Stat label="Avg Views" value={formatFollowers(user.avg_views)} />
          )}
        </div>
      </div>
    </Layout>
  );
}
