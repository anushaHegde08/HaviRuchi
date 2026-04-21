import UserProfile from "@/components/profile/UserProfile";

const Profile = () => {
  return (
    <div className="p-6">
      <UserProfile existingImage="/images/profile.png" />
    </div>
  );
};

export default Profile;
