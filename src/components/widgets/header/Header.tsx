import {Link} from "react-router";
import UserHolder from "@/components/widgets/header/UserHolder.tsx";
import {memo, ReactNode, useEffect, useState} from "react";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import ProjectNavigation from "./ProjectNavigation";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Bell, Menu, X} from "lucide-react"; // Added Menu and X icons
import {useSanctum} from "react-sanctum";


interface HeaderProps {
  children?: ReactNode;
}

function Header({children}: HeaderProps) {
  const {user, authenticated} = useSanctum();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  useEffect(() =>{
    if (authenticated && user) {
        window.Echo.private(`App.Models.User.${user.data.id}`)
            .notification((notification) => {
            setNotifications((prev) => [...prev, notification]);
            });
    }
  }, [authenticated, user])

  return (
    <nav className={'relative flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-16 py-4 border-b-2 bg-linear-[-170deg] from-[#00aeef] via-30% to-[#006fc4] font-inter min-h-[8vh]'}>
      {/* Top bar: Logo, Desktop Nav (hidden on mobile), Icons, Hamburger */}
      <div className="w-full flex items-center justify-between">
        {/* Logo and Title */}
        <div className={'flex flex-row items-center gap-4'}>
           <a href={'https://www.utmn.ru/'} className={"xs:hidden sm:visible"} rel={'noreferrer'}>
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
        {/* Desktop Navigation & Right Icons (visible on sm screens and up) */}
        <div className="hidden sm:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <ProjectNavigation/>
            </NavigationMenuList>
          </NavigationMenu>
          {children}
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

        {/* Mobile: Hamburger and essential icons (visible below sm screens) */}
        <div className="sm:hidden flex items-center gap-3">
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
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-white p-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
       </div>

      {/* Mobile Menu - Collapsible Dropdown (visible below sm screens when open) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden w-full mt-3 py-2 bg-blue-600 bg-opacity-95 rounded-md shadow-lg">
         <NavigationMenu className="w-full">
            <NavigationMenuList className="flex flex-col items-start space-y-1 px-4">
              <ProjectNavigation />
            </NavigationMenuList>
          </NavigationMenu>
          {children && <div className="px-4 pt-2 mt-1 border-t border-blue-500">{children}</div>}        </div>
      )}
    </nav>
   )
 }

export default memo(Header);