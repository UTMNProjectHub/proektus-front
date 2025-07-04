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
import UserBadge from "@/components/ui/userbadge";
import {useEffect, useState} from "react";

function UserHolder() {

  const {user, authenticated, signOut} = useSanctum();
  const navigate = useNavigate();
  const [isPortable, setIsPortable] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsPortable(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          <span>Гость</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link to={"/signin"}>
            <DropdownMenuItem>
              Войти
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }


  // const fullName = user.data.middlename ? `${user.data.surname} ${user.data.firstname.slice(0, 1)}. ${user.data.middlename.slice(0, 1)}.` : `${user.data.surname} ${user.data.firstname.slice(0, 1)}.`;


  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={'flex flex-row gap-2 items-center'}>
        {/* <Avatar className="border-2 border-[#00aeef]">
          <AvatarFallback>{user.data.firstname.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <span className="text-white font-light font-montserrat">{fullName} (@{user.data.name})</span> */}
        <UserBadge className="text-white" user={user.data} withFullName={true} portable={isPortable} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Мой аккаунт
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <Link to={'/profile'}>
            <DropdownMenuItem>
              Профиль
            </DropdownMenuItem>
          </Link>
          <Link to={'/profile/edit'}>
            <DropdownMenuItem>
              Редактировать профиль
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <button className={'w-full text-left'} onClick={()=>{signOut().then(()=>navigate('/'))}}>Выйти</button> {/* could be completely useless refresh, needs checking */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserHolder;