import { Link } from "react-router-dom";

export default function Navbar() {

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">


        <div className="flex h-16 items-center gap-3">

          <div className="logo flex items-center gap-2 shrink-0">
            <Link to="/admin/home" className="flex items-center">
              <div className="h-10 w-10 rounded-lg"><img src="/favicon.png" alt="icon" /></div>
              <h1 className="text-lg font-semibold text-gray-900">
                BookMyVenue • Admin
              </h1>
            </Link>
          </div>


          <div className="searchbar hidden flex-1 px-4 md:block">
            <input
              type="text"
              placeholder="Search venues, cafes, auditoriums..."
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-red-500"
            />
          </div>

        </div>
      </div>     
    </nav>

  )
}

