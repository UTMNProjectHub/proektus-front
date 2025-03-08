import {useSanctum} from "react-sanctum";
import {useEffect} from "react";
import {useNavigate} from "react-router";
import GenericLoader from "@/components/ui/genericLoader.tsx";

function Profile() {
  const {user, authenticated} = useSanctum();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated === false) {
      navigate('/401');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  if (authenticated === null) {
    return(
      <GenericLoader/>
    )
  }

  return (
    <>
      {user && <div>{JSON.stringify(user)}</div>}
    </>
  )
}

export default Profile;