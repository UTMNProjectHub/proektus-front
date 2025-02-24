import './App.css'
import {Route, Routes} from "react-router";
import SignIn from "@/components/pages/signin/SignIn.tsx";
import Dashboard from "@/components/pages/dashboard/Dashboard.tsx";


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/signin' element={<SignIn/>}/>
      </Routes>
    </>
  )
}

export default App;
