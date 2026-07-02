import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => item.account.user_profile);
}

/**
 * Case-insensitive match against username AND fullname.
 * (Previously username matching was case-sensitive while fullname wasn't —
 * fixed so "John" and "john" return the same results.)
 */
export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return profiles;
  return profiles.filter((p) => {
    const matchUsername = p.username.toLowerCase().includes(trimmed);
    const matchFullname = p.fullname.toLowerCase().includes(trimmed);
    return matchUsername || matchFullname;
  });
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export function getPlatformLabel(platform: Platform): string {
  return PLATFORM_LABELS[platform];
}
