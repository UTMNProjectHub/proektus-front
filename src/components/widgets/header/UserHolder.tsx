import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Link, useNavigate} from "react-router";
import {useSanctum} from "react-sanctum";
import {Skeleton} from "@/components/ui/skeleton.tsx";

function UserHolder() {

  const {user, authenticated, signOut} = useSanctum();
  const navigate = useNavigate();

  if (authenticated === null) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className={'flex flex-row gap-2 items-center'}>
          <Skeleton className={'size-8 shrink-0 overflow-hidden rounded-full'}/>
          <Skeleton className={'w-32 h-4'} />
        </DropdownMenuTrigger>
      </DropdownMenu>
    );
  }

  if (!authenticated || !user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className={'flex flex-row gap-2 items-center'}>
          <Avatar>
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
          <span>Guest</span>
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


  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={'flex flex-row gap-2 items-center'}>
        <Avatar>
          <AvatarFallback>{user.data.firstname.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <span>{user.data.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          My account
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <Link to={'/profile'}>
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <button className={'w-full text-left'} onClick={()=>{signOut().then(()=>navigate('/'))}}>Logout</button> {/* could be completely useless refresh, needs checking */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserHolder;