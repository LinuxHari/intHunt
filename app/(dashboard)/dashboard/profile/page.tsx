import ProfilePage from "@/components/dashboard/profile/ProfilePage";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getProfileStats } from "@/lib/actions/user.action";

export const dynamic = "force-dynamic";

const Profile = async () => {
  const profileStats = await getProfileStats();
  const user = await getCurrentUser();

  if (!profileStats.success || !user) throw "Failed to get profile information";

  return <ProfilePage profileStats={profileStats} user={user} />;
};

export default Profile;
