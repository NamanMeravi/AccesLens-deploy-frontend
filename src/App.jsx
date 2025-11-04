 import React from 'react'
 import { Routes, Route } from 'react-router-dom'
 import Home from './pages/Home.jsx'
 import Login from './pages/Login.jsx'
 import Signup from './pages/Sigup.jsx'
 import Dashboard from './pages/Dashboard.jsx'
 import Profile from './pages/Profile.jsx'
 import Navbar from './components/Navbar.jsx'
 import VerifyEmail from './pages/VerifyEmail.jsx'
 import CreateProject from './pages/CreateProject.jsx'
 const App = () => {
   return (
    <div className='bg-zinc-950 min-h-screen text-white'>
    <Navbar />
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/login" element={<Login />} />
       <Route path="/signup" element={<Signup />} />
       <Route path="/dashboard/:id" element={<Dashboard />} />
       <Route path="/create-project" element={<CreateProject />} />
       <Route path="/profile" element={<Profile />} />
       <Route path="/verify-email" element={<VerifyEmail />} />
      
     </Routes>
    </div>
   )
 }
 
 export default App
 