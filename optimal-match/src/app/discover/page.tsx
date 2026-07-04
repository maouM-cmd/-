import { DiscoverView } from "@/components/DiscoverView";
import { getDiscoverableProfiles } from "@/lib/db";
import { withMatches } from "@/lib/match";
import { requireProfile } from "@/lib/session";

export default async function DiscoverPage() {
  const { profile } = await requireProfile();
  const matches = withMatches(profile, getDiscoverableProfiles(profile.id));

  return <DiscoverView meName={profile.name} matches={matches} />;
}
