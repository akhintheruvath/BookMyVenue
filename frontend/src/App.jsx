import { Routes, Route } from 'react-router-dom';

import { SigninModal } from './components/shared/SigninModal.jsx';
import { UserLayout } from './pages/UserPages/UserLayout.jsx';
import { VenueOwnerLayout } from './pages/OwnerPage/VenueOwnerLayout.jsx';
import { AdminLayout } from './pages/AdminPage/AdminLayout.jsx';
import { Home, Venue, Category,VenueDetails } from './pages/UserPages/UserPages.js';
import { AdminLogin,AdminHome } from './pages/AdminPage/AdminPages.js';
import {VenueOwnerLogin,VenueOwnerDashboard,VenueOwnerMyVenues} from './pages/OwnerPage/VenueOwnerPage.js'

function App() {
  return (
    <>
      {/* Global sign-in popup — opened from anywhere via useAuth().openSignin() */}
      <SigninModal />

      <Routes>
        {/* Public User Routes */}
        <Route element={<UserLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/venue' element={<Venue />} />
          <Route path='/venue/:id' element={<VenueDetails />} />
          <Route path='/venue/category' element={<Category />} />
        </Route>

        {/* Venue Owner Routings */}
        <Route path='/venue-owner' element={<VenueOwnerLogin />} />
        <Route element={<VenueOwnerLayout />}>
          <Route path='/venue-owner/home' element={<VenueOwnerDashboard />} />
          <Route path='/venue-owner/my-venues' element={<VenueOwnerMyVenues />} />
        </Route>

        {/* Admin Routings */}
        <Route path='/admin' element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path='/admin/home' element={<AdminHome />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;