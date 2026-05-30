import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'

// Root component. For now it renders the Navbar + Home page directly.
// TODO: once we add more pages, introduce React Router here
// (npm install react-router-dom) and swap <Home /> for <Routes>.
function App() {
  return (
    <div className="app">
      <Navbar />
      <Home />
    </div>
  )
}

export default App;