import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Sidebar() {
    const { role } = useAuth();
    const location = useLocation();

    function translateRole(role) {
        if (role === "admin") {
            return "Administrador";
        } else if (role === "user") {
            return "Usuario";
        } else if (role === "guest") {
            return "Invitado";
        }
        return role; // si no coincide, devuelve el valor original
    }

    const linkClass = (path) =>
        `block py-2 px-4 rounded-lg hover:bg-cyan-900/30 ${location.pathname === path ? "font-semibold bg-cyan-900/30 text-white" : ""
        }`;

    return (
        <aside className="w-64 bg-cyan-900/30 font-medium text-gray-50 my-4 ml-6 rounded-2xl">
            <div className="flex flex-col items-center py-4">
                <img src="/mh.png" alt="Manta Hills Logo" className="w-32" />
                {/* <span className="text-sm font-medium">Manta Hills</span> */}
            </div>
            <div className="flex flex-col font-normal items-center py-2 border-b border-cyan-900/20">
                <p>{translateRole(role)}</p>
            </div>

            <nav className="space-y-3 p-4">
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                    Dashboard
                </Link>

                <Link to="/lotes" className={linkClass("/lotes")}>
                    Lotes
                </Link>

                <Link to="/docs" className={linkClass("/docs")}>
                    Documentos
                </Link>

                {role === "admin" && (
                    <Link to="/admin" className={linkClass("/admin")}>
                        Administración
                    </Link>
                )}
            </nav>

            <div className="w-full px-4">
                <button
                    onClick={() => signOut(auth)}
                    className="w-full bg-red-600 text-white font-medium py-2 rounded-lg hover:bg-red-700"
                >
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
