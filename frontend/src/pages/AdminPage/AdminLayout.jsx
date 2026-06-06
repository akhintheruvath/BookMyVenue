import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar.jsx";

// Shared chrome for admin routes that show the navbar (e.g. /admin/home).
// The login route is rendered outside this layout.
export function AdminLayout() {
  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <Outlet />
    </div>
  );
}
