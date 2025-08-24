import UserProfileForm from "@/components/dashboard/profile/UserProfileForm";
import UpdatePasswordForm from "@/components/dashboard/profile/UpdatePasswordForm";
import ProfileStats from "@/components/dashboard/profile/ProfileStats";
import ProfileActions from "./ProfileActions";

interface ProfilePageProps {
  profileStats: ReturnProfile;
  user: User;
}

const ProfilePage = ({ profileStats, user }: ProfilePageProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <UserProfileForm user={user} />
          <UpdatePasswordForm />
        </div>
        <div className="space-y-6">
          <ProfileStats profileStats={profileStats} />
          <ProfileActions />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
