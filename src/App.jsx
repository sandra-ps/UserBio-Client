
import './App.css'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Profile from './pages/profile'
import { HelmetProvider } from 'react-helmet-async';

function App() {
 

  return (
    <>
     <HelmetProvider>
     <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
     </HelmetProvider>
    
    </>
  )
}

export default App
