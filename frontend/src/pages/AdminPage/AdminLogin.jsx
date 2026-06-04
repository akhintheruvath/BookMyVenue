import { Link } from "react-router-dom"
export function AdminLogin() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">

            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">

                <h1 className="mb-6 text-center text-2xl font-bold">
                    Admin Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="mb-4 w-full rounded-lg border p-3"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="mb-4 w-full rounded-lg border p-3"
                />

                <Link to='/admin/home'>
                    <button className="w-full rounded-lg bg-red-600 py-3 text-white">
                        Login
                    </button>
                </Link>

            </div>

        </div>
    )
}