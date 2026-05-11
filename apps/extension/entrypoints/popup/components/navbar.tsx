import { useUser } from "@clerk/chrome-extension";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@snappin/ui/components/avatar";
import SnappinLogo from "/favicon.svg"

export const Navbar = () => {
  const { user } = useUser();
  return (
    <div className="flex items-center bg-background justify-between border-b p-4 py-3">
      <div>
        <img src={SnappinLogo} className="size-7" />
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="size-7">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>{user.email_addresses[0]?.email_address.split("@")[0]}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
