import './App.css'
import Header from "@/components/widgets/header/Header.tsx";
import {useSanctum} from "react-sanctum";
import {useEffect} from "react";



function App() {
  const {user, checkAuthentication} = useSanctum();

  useEffect(()=>{
    checkAuthentication();
  }, []);

  return (
    <>
      <Header user={user}></Header>
    </>
  )
}

export default App
