import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar.jsx'
import VenueOwnerNavbar from './components/VenueOwnerNavbar.jsx'
import { SigninModal } from './components/SigninModal.jsx';
import { Home, Venue, Category } from './pages/UserPages/UserPages.js';
import { AdminLogin,AdminHome } from './pages/AdminPage/AdminPages.js';
import {VenueOwnerHome,VenueOwnerLogin} from './pages/OwnerPage/VenueOwnerPage.js'

function App() {
  return (
    <>
      {/* Global sign-in popup — opened from anywhere via useAuth().openSignin() */}
      <SigninModal />

      <Routes>
        {/* Public User Routes */}
        <Route path='/' element={
          <div className="min-h-screen">
            <Navbar />
            <Home />
          </div>
        } />
        <Route path='/venue' element={
          <div className="min-h-screen">
            <Navbar />
            <Venue />
          </div>
        } />
        <Route path='/venue/category' element={
          <div className="min-h-screen">
            <Navbar />
            <Category />
          </div>
        } />


        {/* Venue Owner Routings */}
        <Route path='/venue-owner' element={<VenueOwnerLogin />} />
        <Route path='/venue-owner/home' element={
          <div className="min-h-screen">
            <VenueOwnerNavbar />
            <VenueOwnerHome />
          </div>
        } />

        {/* Admin Routings */}
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/home' element={
          <div className="min-h-screen">
            <AdminNavbar />
            <AdminHome />
          </div>
        } />
      </Routes>
    </>
  )
}

export default App;