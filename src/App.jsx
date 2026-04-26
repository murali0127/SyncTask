import { Routes, Route } from 'react-router-dom';
import DashBoard from './pages/DashBoard';
import HomePage from './pages/HomePage';
import LoginForm from './pages/Login'
import SignInForm from './pages/SignUp';
import UserProfile from './Profile/Userprofile';
import ProfileEditForm from './Profile/ProfileEditForm'
import ProtectedRoutes from './routes/ProtectedRoutes';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Routes>
        <Route path="/" >
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignInForm />} />
          <Route path="dashboard" element={
            <ProtectedRoutes>
              <DashBoard />
            </ProtectedRoutes>
          } />
          <Route path="profile" element={<UserProfile />} />
          <Route path="profile/editProfile" element={<ProfileEditForm />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
