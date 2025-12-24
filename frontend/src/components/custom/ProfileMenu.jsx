import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthProvider";

const ProfileMenu = () => {
  const { auth, logout } = useAuth();

  if (!auth.user) return null;

  const firstLetter = auth.user.username?.charAt(0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="h-10 w-10 shadow-md">
            <AvatarImage src={auth.user.image} alt={auth.user.username} />
            <AvatarFallback
  className="
    bg-gradient-to-br from-red-600 to-orange-500
    text-white
    font-bold
    text-lg
    flex items-center justify-center
    
  "
>
  {firstLetter}
</AvatarFallback>

          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 bg-amber-50 border border-amber-200"
      >
        <div className="px-3 py-2 text-sm font-medium text-red-800">
          {auth.user.name}
        </div>

        <DropdownMenuSeparator className="bg-amber-200" />

        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer text-red-700 hover:bg-red-50"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
