import {createRoot} from 'react-dom/client'
import './index.css'
import axios from 'axios';
import App from './App.tsx'
import {BrowserRouter, Routes, Route} from "react-router";
import SignIn from "@/pages/signin/ui/SignIn.tsx";
import {Sanctum} from "react-sanctum";

axios.defaults.baseURL = import.meta.env.VITE_APP_URL;
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const sanctumAxiosInstance = axios.create({
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const sanctumConfig = {
  apiUrl: import.meta.env.VITE_APP_URL,
  csrfCookieRoute: 'sanctum/csrf-cookie',
  signInRoute: 'login',
  signOutRoute: 'logout',
  userObjectRoute: 'api/user',
  axiosInstance: sanctumAxiosInstance,
}

axios.interceptors.response.use(res => res, async err => { // handle 419 on request if necessary
  const code = err.response.status;

  if (code == 419) {
    await axios.get('/sanctum/csrf-token')

    return axios(err.response.config)
  }

  return Promise.reject(err);
});

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Sanctum config={sanctumConfig}>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/signin' element={<SignIn/>}/>
      </Routes>
    </Sanctum>
  </BrowserRouter>
)
