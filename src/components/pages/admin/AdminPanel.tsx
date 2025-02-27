import Header from "@/components/widgets/header/Header.tsx";
import {useSanctum} from "react-sanctum";
import {useNavigate} from "react-router";
import {useEffect} from "react";
import {SyncLoader} from "react-spinners";

function AdminPanel() {
  const {user, authenticated} = useSanctum();
  const navigate = useNavigate();

  useEffect(()=> {
    if (authenticated === false) {
      navigate('/401');
    }

    if (authenticated === true && !user.data.roles.includes('admin')) {
      navigate('/401');
    }

  }, [authenticated])

  if (authenticated === null) {
    return (
      <>
        <Header/>
        <div className={'grid h-screen place-items-center'}>
          <SyncLoader className={'rotate-90'}/>
        </div>

      </>
    )
  }

  return (
    <>
      <Header/>
      <div className={'flex'}>

      </div>
    </>
  );
}

export default AdminPanel;