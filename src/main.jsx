import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App.jsx'
import AppProvider from './providers/AppProvider.jsx';
import AuthProvider from './lib/context/AuthContext.jsx'
import TodoProvider from './lib/context/TodoContext.jsx'
import { BrowserRouter } from "react-router-dom"
import ListProvider from './lib/context/ListContext.jsx'
import { registerSW } from './services/notificationService.js'
import AiProvider from './lib/context/AiContext.jsx'

//SW register is a browser API call
registerSW();  //--> Runs immediately after the js bundles loads.

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ListProvider>
          <TodoProvider>
            <AppProvider>
              <AiProvider>
                <App />
              </AiProvider>
            </AppProvider>
          </TodoProvider>
        </ListProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
