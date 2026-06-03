import {Routes,Route} from 'react-router-dom';

import Navbar from './components/Navbar';
import {Home,Venue,Category,Signin} from './pages/UserPages/UserPages.js';
import {AdminLogin} from './pages/AdminPage/AdminPages.js';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/venue' element={<Venue/>}/>
        <Route path='/category' element={<Category/>}/>
        <Route path='/signin' element={<Signin/>}/>

        <Route path='/admin' element={<AdminLogin/>}/>
      </Routes>
    </div>
  )
}

export default App;