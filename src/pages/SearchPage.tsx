import { useCallback, useMemo, useState } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  // extractProfiles/filterProfiles are pure and cheap-but-not-free (array maps/filters
  // over JSON data) — memoize so they only re-run when platform or query actually change,
  // not on every render of the page (e.g. when the shortlist drawer toggles).
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  // Previously this logged `clickCount` read from a stale closure before the
  // state update applied, so the logged value always lagged by one click.
  // The counter served no real purpose, so it's removed; we just log the nav.
  const handleProfileClick = useCallback((username: string) => {
    console.log("Navigating to profile:", username);
  }, []);

  return (
    <Layout
      title="Find Influencers"
      subtitle="Browse top creators across social platforms"
    >
      <PlatformFilter
        selected={platform}
        onChange={handlePlatformChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <p className="text-xs text-gray-400 mb-3">
        Showing {filtered.length} of {allProfiles.length} on {platform}
      </p>

      <ProfileList
        profiles={filtered}
        platform={platform}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}
