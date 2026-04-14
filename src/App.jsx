import { Routes, Route } from 'react-router-dom';
import DashBoard from './pages/DashBoard';
import HomePage from './pages/HomePage';
import LoginForm from './pages/Login'
import SignInForm from './pages/SignUp';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Routes>
        <Route path="/" >
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignInForm />} />
          <Route path="dashboard" element={<DashBoard />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
