import {Link} from "react-router";
import {useSanctum} from "react-sanctum";
import UserHolder from "@/components/widgets/header/UserHolder.tsx";
import {memo, ReactNode} from "react";


interface HeaderProps {
  children?: ReactNode;
}

function Header({children}: HeaderProps) {
  const {signOut, user} = useSanctum();

  return (
    <nav className={'flex flex-row items-center justify-between px-16 py-4 border-b-2'}>
      <Link to={'/'}>
        <div className={'flex'}>
          <a className={'text-2xl font-extrabold tracking-tighter'}>Проектус</a>
        </div>
      </Link>
      {children}
      <UserHolder userData={user} logout={signOut}/>
    </nav>
  )
}

export default memo(Header);