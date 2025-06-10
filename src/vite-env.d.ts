/// <reference types="vite/client" />

interface Window {
  Echo: any; // Or a more specific type if you have one for Echo
  Pusher: any; // Assuming Pusher is also on the window object, as seen in main.tsx
}
