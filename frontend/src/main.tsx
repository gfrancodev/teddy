import { createRoot } from 'react-dom/client'
import App from './app.tsx'
import '@/core/styles/index.css'

createRoot(document.getElementById("root")!).render(<App />);
