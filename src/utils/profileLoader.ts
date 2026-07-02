import type { ProfileDetailResponse } from "@/types";

/*
 * Vite's import.meta.glob eagerly builds a map of all JSON files under the
 * profiles directory at build time. At runtime we just look up the path and
 * call the lazy loader — no network request, no fetch.
 */
const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];

  if (!loader) return null;

  const result = await loader();
  // Vite wraps JSON imports in a `{ default: ... }` wrapper in some configs.
  const data = (result as { default?: ProfileDetailResponse }).default ?? result;
  return data as ProfileDetailResponse;
}
