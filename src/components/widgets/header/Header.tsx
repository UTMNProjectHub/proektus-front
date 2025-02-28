import {Link} from "react-router";
import UserHolder from "@/components/widgets/header/UserHolder.tsx";
import {memo, ReactNode} from "react";


interface HeaderProps {
  children?: ReactNode;
}

function Header({children}: HeaderProps) {

  return (
    <nav className={'flex flex-row items-center justify-between px-16 py-4 border-b-2'}>
      <Link to={'/'}>
        <div className={'flex'}>
          <span className={'text-2xl font-extrabold tracking-tighter'}>Проектус</span>
        </div>
      </Link>
      {children}
      <UserHolder/>
    </nav>
  )
}

export default memo(Header);