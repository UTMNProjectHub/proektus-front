import "./App.css";
import { Route, Routes } from "react-router";
import SignIn from "@/components/pages/signin/SignIn.tsx";
import Dashboard from "@/components/pages/dashboard/Dashboard.tsx";
import AdminPanel from "@/components/pages/admin/AdminPanel.tsx";
import Profile from "@/components/pages/profile/Profile.tsx";
import ErrorPage from "@/components/pages/error/ErrorPage.tsx";
import Header from "@/components/widgets/header/Header.tsx";
import Footer from "@/components/widgets/footer/Footer.tsx";
import LoadingForm from "@/components/widgets/projectFileLoading/LoadingForm.tsx";
import ProjectCreate from "./components/pages/project/create/ProjectCreate";
import ProjectPage from "./components/pages/project/ProjectView";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectPage/>} />
        <Route path="/projects/my" element={<Dashboard />} />
        <Route path="/projects/create" element={<ProjectCreate />} />
        <Route
          path="*"
          element={<ErrorPage error={404} message={"Page not found"} />}
        />
        <Route
          path="401"
          element={<ErrorPage error={401} message={"Unauthorized"} />}
        />
        <Route
          path="500"
          element={
            <ErrorPage
              error={500}
              message={"Server error. Contant an admin."}
            />
          }
        />
        <Route path={"project/file"} element={<LoadingForm />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
