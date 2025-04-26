import {Link} from "react-router";
import UserHolder from "@/components/widgets/header/UserHolder.tsx";
import {memo, ReactNode} from "react";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import ProjectNavigation from "./ProjectNavigation";


interface HeaderProps {
  children?: ReactNode;
}

function Header({children}: HeaderProps) {

  return (
    <nav className={'flex flex-row items-center justify-between px-16 py-4 border-b-2 max-h-16 bg-linear-[-170deg] from-[#00aeef] via-30% to-[#006fc4] font-inter'}>
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
      <UserHolder/>
    </nav>
  )
}

export default memo(Header);