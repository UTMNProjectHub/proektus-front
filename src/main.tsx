import {createRoot} from 'react-dom/client'
import './index.css'
import axios from 'axios';
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import {Sanctum} from "react-sanctum";
import Pusher from "pusher-js";
import Echo from "laravel-echo";

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

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'reverb',
  authEndpoint: `${import.meta.env.VITE_APP_URL}/broadcasting/auth`,
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
  authorizer: (channel) => {
    return {
      authorize: (socketId, callback) => {
        axios.post('/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name,
        })
            .then(response => {
              callback(null, response.data);
            })
            .catch(error => {
              callback(error, null);
            });
      }
    };
  },
});

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Sanctum config={sanctumConfig} checkOnInit={true}>
        <App/>
    </Sanctum>
  </BrowserRouter>
)
