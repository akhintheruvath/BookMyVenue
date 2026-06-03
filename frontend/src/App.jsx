import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import { Home, Venue, Category, Signin } from './pages/UserPages/UserPages.js';
import { AdminLogin } from './pages/AdminPage/AdminPages.js';

function App() {
  return (


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
      <Route path='/category' element={
        <div className="min-h-screen">
          <Navbar />
          <Category />
        </div>
      } />
      <Route path='/signin' element={
        <div className="min-h-screen">
          <Navbar />
          <Signin />
        </div>
      } />

      <Route path='/admin' element={<AdminLogin />} />
    </Routes>

  )
}

export default App;