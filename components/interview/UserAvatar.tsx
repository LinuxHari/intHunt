import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: User;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  user,
  className,
  fallbackClassName,
}: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-9 w-9", className)}>
      <AvatarImage src={user.image} alt={user.name} />
      <AvatarFallback
        className={cn(
          "bg-gray-100 dark:bg-gray-800 font-medium",
          fallbackClassName
        )}
      >
        {user.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
