import {Link} from "react-router";
import UserHolder from "@/components/widgets/header/UserHolder.tsx";
import {memo, ReactNode, useEffect, useState} from "react";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import ProjectNavigation from "./ProjectNavigation";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Bell, Menu, X} from "lucide-react"; // Added Menu and X icons
import {useSanctum} from "react-sanctum";
import NotificationItem, { AppNotification } from './NotificationItem';
import axios from "axios";
import {toast} from "sonner";

interface HeaderProps {
  children?: ReactNode;
}

function Header({children}: HeaderProps) {
  const {user, authenticated} = useSanctum();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const fetchNotifications = () => {
    if (authenticated && user) {
      setIsLoadingNotifications(true);
      axios.get('/api/profile/notifications')
        .then((response) => {
          // Transform the API response to match the AppNotification structure
          const fetchedNotifications: AppNotification[] = response.data.map((item: any) => ({
            id: item.id,
            type: item.type, // This is the main type, e.g., "App\\Notifications\\FileProcessed"
            message: item.data.message,
            status: item.data.status,
            project_id: item.data.project_id,
            user_id: item.data.user_id,
            created_at: item.created_at,
            read_at: item.read_at,
          }));
          setNotifications(fetchedNotifications);
        })
        .catch(error => {
          console.error("Error fetching notifications:", error);
          // Optionally, set an error state here to display to the user
        })
        .finally(() => {
          setIsLoadingNotifications(false);
        });
    }
  };

  const handleNotificationDismiss = (notification: AppNotification) => {
    axios.delete(`/api/profile/notifications/${notification.id}`).then((response) => {
      if (response.status === 200) {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }
    }).catch((err) => {
      toast.error("Ошибка при удалении уведомления", err.message);
    })
  }

  console.log(notifications);

  const markNotificationsAsRead = () => {
    axios.post('/api/profile/notifications')
      .then(() => {
        // Optimistically update the UI or re-fetch
        setNotifications(prev => 
          prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        );
      })
      .catch(error => {
        console.error("Error marking notifications as read:", error);
      });
  };

  useEffect(() =>{
    fetchNotifications(); // Fetch initial notifications

    if (authenticated && user && window.Echo) {
      console.log('Attempting to subscribe to private channel. User ID:', user.data.id);

      const channelName = `App.Models.User.${user.data.id}`;
      const privateChannel = window.Echo.private(channelName);

      privateChannel.on('pusher:subscription_succeeded', () => {
        console.log(`Successfully subscribed to private channel: ${channelName}`);
      });

      privateChannel.notification((notification: AppNotification) => {
        console.log('Received notification:', notification);
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        window.Echo.leave(channelName);
      };
    } else {
      if (!window.Echo) {
        console.warn('window.Echo is not initialized when attempting to subscribe.');
      }
    }
  }, [authenticated, user]);

  return (
    <nav className={'relative flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-16 py-4 border-b-2 bg-linear-[-170deg] from-[#00aeef] via-30% to-[#006fc4] font-inter min-h-[8vh]'}>
      {/* Top bar: Logo, Desktop Nav (hidden on mobile), Icons, Hamburger */}
      <div className="w-full flex items-center justify-between">
        {/* Logo and Title */}
        <div className={'flex flex-row items-center gap-4'}>
           <a href={'https://www.utmn.ru/'} className={"hidden md:inline"} rel={'noreferrer'}>
             <div className={'flex'}>
               <img src={'https://www.utmn.ru/upload/medialibrary/47f/logo_utmn_mini2_rus.png'} alt={'utmn'}
                   className={'h-8 brightness-0 invert'}/>
             </div>
           </a>
           <p className="text-white hidden md:inline">|</p>
           <Link to={'/'}>
             <div className={'flex align-text-bottom'}>
               <span className={'sm:text-lg lg:text-2xl font-bold tracking-tight font-montserrat text-white'}>Проектус</span>
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
            <PopoverTrigger onClick={() => { 
              if (notifications.some(n => !n.read_at)) {
                markNotificationsAsRead();
              }
            }}>
              <Bell className={'size-5 invert'} />
              {notifications.some(value => !value.read_at) && (
                <span className="top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
              )}
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-96 overflow-y-auto">
              <div className="p-2">
                <h3 className={'text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 border-b pb-2 flex justify-between items-center'}>
                  Уведомления
                  {notifications.some(n => !n.read_at) && (
                    <button 
                      onClick={markNotificationsAsRead}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                    >
                      Пометить все как прочитанные
                    </button>
                  )}
                </h3>
                {isLoadingNotifications ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Загружаю уведомления...</p>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDismiss={(notification) => handleNotificationDismiss(notification)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Нет новых уведомлений.</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <UserHolder/>
        </div>

        {/* Mobile: Hamburger and essential icons (visible below sm screens) */}
        <div className="sm:hidden flex items-center gap-3">
          <Popover>
            <PopoverTrigger onClick={() => { 
              // Mark as read when popover is opened, if there are unread notifications
              if (notifications.some(n => !n.read_at)) {
                markNotificationsAsRead();
              }
            }}>
              <Bell className={'size-5 invert'} />
              {notifications.some(n => !n.read_at) && (
                <span className="top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
              )}
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-96 overflow-y-auto"> {/* Added width, max-height and overflow */}
               <div className="p-2">
                <h3 className={'text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 border-b pb-2 flex justify-between items-center'}>
                  Уведомления
                  {notifications.some(n => !n.read_at) && (
                    <button 
                      onClick={markNotificationsAsRead}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                    >
                      Mark all as read
                    </button>
                  )}
                </h3>
                {isLoadingNotifications ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Loading notifications...</p>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDismiss={(notification) => handleNotificationDismiss(notification)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Нет новых уведомлений.</p>
                )}
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