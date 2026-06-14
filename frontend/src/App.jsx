import { Routes, Route } from 'react-router-dom';

import { SigninModal } from './components/shared/SigninModal.jsx';
import { ToastViewport } from './components/shared/ToastViewport.jsx';
import { RequireAuth } from './components/shared/RequireAuth.jsx';
import { UserLayout } from './pages/UserPages/UserLayout.jsx';
import { VenueOwnerLayout } from './pages/OwnerPage/VenueOwnerLayout.jsx';
import { AdminLayout } from './pages/AdminPage/AdminLayout.jsx';
import { Home, Venue, Category,VenueDetails } from './pages/UserPages/UserPages.js';
import { AdminLogin,AdminHome } from './pages/AdminPage/AdminPages.js';
import {VenueOwnerLogin,VenueOwnerDashboard,VenueOwnerMyVenues,AddVenuePage,EditVenuePage} from './pages/OwnerPage/VenueOwnerPage.js'

function App() {
  return (
    <>
      {/* Global overlays — mounted once, fired from anywhere */}
      <SigninModal />
      <ToastViewport />

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
        <Route element={<RequireAuth roles={['venueOwner']} loginPath='/venue-owner' />}>
          <Route element={<VenueOwnerLayout />}>
            <Route path='/venue-owner/dashboard' element={<VenueOwnerDashboard />} />
            <Route path='/venue-owner/my-venues' element={<VenueOwnerMyVenues />} />
            <Route path='/venue-owner/venues/new' element={<AddVenuePage />} />
            <Route path='/venue-owner/venues/edit/:id' element={<EditVenuePage />} />
          </Route>
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