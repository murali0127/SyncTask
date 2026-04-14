import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client';
import { AppProvider } from './providers/AppProvider';
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
)
