import {useSanctum} from "react-sanctum";
import {useNavigate} from "react-router";
import {useEffect} from "react";
import GenericLoader from "@/components/ui/genericLoader.tsx";

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated])

  if (authenticated === null) {
    return (
      <GenericLoader/>
    )
  }

  return (
    <>
      <div className={'flex'}>

      </div>
    </>
  );
}

export default AdminPanel;