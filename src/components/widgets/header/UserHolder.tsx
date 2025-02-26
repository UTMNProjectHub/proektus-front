import {User} from "@/models/user/type.ts";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Link} from "react-router";

interface UserHolderProps {
  userData: {data: User} | null,
  logout: () => Promise<void>,
}

function UserHolder({userData, logout}: UserHolderProps) {

  if (!userData) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className={'flex flex-row gap-2 items-center'}>
          <Avatar>
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
          <a>Guest</a>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link to={"/signin"}>
            <DropdownMenuItem>
              Login
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const user = userData.data as User;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={'flex flex-row gap-2 items-center'}>
        <Avatar>
          <AvatarFallback>{user.firstname.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <a>{user.name}</a>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          My account
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <button onClick={()=>{logout().then(()=>window.location.reload())}}>Logout</button> {/* could be completely useless refresh, needs checking */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserHolder;