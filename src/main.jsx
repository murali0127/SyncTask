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

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ListProvider>
          <TodoProvider>
            <AppProvider>
              <App />
            </AppProvider>
          </TodoProvider>
        </ListProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
