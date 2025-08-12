import ProfilePage from "@/components/dashboard/profile/ProfilePage";
import { getProfileStats } from "@/lib/actions/user.action";

export const dynamic = "force-dynamic";

const Profile = async () => {
  const profileStats = await getProfileStats();

  if (!profileStats.success) throw "Failed to get profile information";

  return <ProfilePage profileStats={profileStats} />;
};

export default Profile;
