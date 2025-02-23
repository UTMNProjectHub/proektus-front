import {User} from "@/models/user/type.ts";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Link} from "react-router";
import {useSanctum} from "react-sanctum";


interface HeaderProps {
  user: User
}

function Header({user}: HeaderProps) {
  const {signOut} = useSanctum();

  function logout() {
    console.log('trying to logout');
    signOut();
  }

  if (!user) {
    return (
      <nav className={'flex flex-row items-center justify-between px-16 py-4 border-b-2'}>
        <Link to={'/'}><div className={'flex'}>
          <a className={'text-2xl font-extrabold tracking-tighter'}>Проектус</a>
        </div></Link>
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
      </nav>
    )
  }

  return (
    <div className={'flex flex-row items-center'}>
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
              <button onClick={logout}>Logout</button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Header;