import {Link} from "react-router";
import UserHolder from "@/components/widgets/header/UserHolder.tsx";
import {memo, ReactNode, useEffect, useState} from "react";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import ProjectNavigation from "./ProjectNavigation";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Bell} from "lucide-react";
import {useSanctum} from "react-sanctum";


interface HeaderProps {
  children?: ReactNode;
}

function Header({children}: HeaderProps) {
  const {user, authenticated} = useSanctum();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() =>{
    if (authenticated && user) {
        window.Echo.private(`App.Models.User.${user.data.id}`)
            .notification((notification) => {
            setNotifications((prev) => [...prev, notification]);
            });
    }
  }, [authenticated, user])

  return (
    <nav className={'flex flex-row items-center justify-between px-16 py-4 border-b-2 max-h-[8vh] bg-linear-[-170deg] from-[#00aeef] via-30% to-[#006fc4] font-inter'}>
      <div className="flex flex-row space-x-8">
        <div className={'flex flex-row items-center gap-4'}>
          <a href={'https://www.utmn.ru/'} rel={'noreferrer'}>
            <div className={'flex'}>
              <img src={'https://www.utmn.ru/upload/medialibrary/47f/logo_utmn_mini2_rus.png'} alt={'utmn'}
                  className={'h-8 brightness-0 invert'}/>
            </div>
          </a>
          <p className="text-white">|</p>
          <Link to={'/'}>
            <div className={'flex align-text-bottom'}>
              <span className={'text-2xl font-bold tracking-tight font-montserrat text-white'}>Проектус</span>
            </div>
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <ProjectNavigation/>
          </NavigationMenuList>
        </NavigationMenu>
        {children}
      </div>
      <div className={'inline-flex gap-4'}>
        <Popover>
          <PopoverTrigger>
            <Bell className={'size-5 invert'} />
          </PopoverTrigger>
          <PopoverContent>
            <div>
                <h3 className={'text-gray-500'}>Уведомления</h3>
            </div>
          </PopoverContent>
        </Popover>
        <UserHolder/>
      </div>
    </nav>
  )
}

export default memo(Header);