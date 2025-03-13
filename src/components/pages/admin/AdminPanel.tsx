import {useSanctum} from "react-sanctum";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import GenericLoader from "@/components/ui/genericLoader.tsx";
import {getAllUsers} from "@/components/pages/admin/api/user.ts";
import {User} from "@/components/pages/admin/api/type.ts";
import DataTable from "@/components/pages/admin/ui/data-table.tsx";
import {userColumns} from "@/components/pages/admin/ui/user/columns.tsx";
import {toast} from "sonner"
import {Toaster} from '@/components/ui/sonner.tsx';

function AdminPanel() {
  const {user, authenticated} = useSanctum();
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();



  useEffect(()=> {
    if (authenticated === false) {
      navigate('/401');
    }

    if (authenticated === true && !user.data.roles.includes('admin')) {
      navigate('/401');
    }

    if (authenticated === true && user.data.roles.includes('admin')) {
      getAllUsers().then((response) => {
        setUsers(response);
      }).catch((error) => {
        toast.error(error.message);
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated])

  if (authenticated === null) {
    return (
      <GenericLoader/>
    )
  }

  return (
    <>
      <Toaster/>
      <div className={'flex my-4'}>
        <div className={'container w-2/3 mx-auto'}>
          <DataTable columns={userColumns} data={users}/>
        </div>
      </div>
    </>
  );
}

export default AdminPanel;