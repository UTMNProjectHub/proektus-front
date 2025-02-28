import './App.css'
import {Route, Routes} from "react-router";
import SignIn from "@/components/pages/signin/SignIn.tsx";
import Dashboard from "@/components/pages/dashboard/Dashboard.tsx";
import AdminPanel from "@/components/pages/admin/AdminPanel.tsx";
import Profile from "@/components/pages/profile/Profile.tsx";
import ErrorPage from "@/components/pages/error/ErrorPage.tsx";


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/admin' element={<AdminPanel/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='*' element={<ErrorPage error={404} message={'Page not found'}/>}/>
        <Route path='401' element={<ErrorPage error={401} message={'Unauthorized'}/>}/>
      </Routes>
    </>
  )
}

export default App;
