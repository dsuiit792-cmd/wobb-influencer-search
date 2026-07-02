/**
 * Compact follower/engagement counts, e.g. 12345 -> "12.3K", 4200000 -> "4.2M".
 * Used everywhere a count needs to be displayed so formatting stays consistent
 * (previously ProfileCard and ProfileDetailPage each had their own slightly
 * different copy of this logic).
 */
export function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1) + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1) + "K";
  }
  return count.toString();
}

/**
 * Engagement rate is stored as a fraction (e.g. 0.034 = 3.4%).
 * Multiply by 100, not 10000, to convert to a percentage.
 */
export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}
