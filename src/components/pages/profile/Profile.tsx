import Header from "@/components/widgets/header/Header.tsx";
import {useSanctum} from "react-sanctum";

function Profile() {
  const {user} = useSanctum();

  return (
    <>
      <Header/>
      {user && <div>{JSON.stringify(user)}</div>}
    </>
  )
}

export default Profile;