import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function Sidebar() {
    const { role } = useAuth();
    const location = useLocation();
    const [open, setOpen] = useState(false)

    function translateRole(role) {
        if (role === "admin") return "Administrador";
        if (role === "user") return "Vendedor";
        if (role === "guest") return "Invitado";
        return role; // si no coincide, devuelve el valor original
    }

    const linkClass = (path) =>
        `block py-2 px-4 rounded-lg hover:bg-cyan-900/30 ${location.pathname === path ? "font-semibold bg-cyan-900/30 text-white" : ""
        }`;

    return (
        <>
            {/* Mobile */}
            <div className={`
                md:hidden fixed top-0 py-2 px-8 z-50 
                flex justify-between items-center text-cyan-950 
                ${open ? "bg-none" : "bg-[#b7c9d4]"}
                w-full backdrop-blur-sm`
            }>
                <p className={`font-semibold text-lg transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100" }`}>Manta Hills</p>
                <button onClick={() => setOpen(!open)}
                    className="text-lg font-medium p-1 hover:bg-cyan-800 rounded-md transition-colors"
                    aria-label={open ? "Cerrar menú" : "Abrir menú"}
                >
                    {open ? "✕" : "☰"}
                </button>
            </div>

            {/* Overlay */}
            {open && (
                <div onClick={() => setOpen(false)} className="fixed inset-0 bg-gray-400/40 z-40 md:hidden" />
            )}

            {/* Sidebar */}
            <aside
                className={`
                fixed md:static top-0 left-0 z-50 
                min-h-full w-64 
                bg-[#b7c9d4] font-medium text-gray-50 
                rounded-r-2xl md:rounded-2xl
                transform transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
                md:my-4 md:ml-6
            `}>
                {/* // className="w-64 bg-cyan-900/30 font-medium text-gray-50 my-4 ml-6 rounded-2xl"> */}
                {/* Header */}
                <div className="flex flex-col items-center py-4">
                    <img src="/mh.png" alt="Manta Hills Logo" className="w-32" />
                    {/* <span className="text-sm font-medium">Manta Hills</span> */}
                </div>
                <div className="flex flex-col font-normal items-center py-2 border-b border-cyan-900/20">
                    <p>{translateRole(role)}</p>
                </div>

                {/* Nav */}
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

                {/* Logout */}
                <div className="w-full px-4">
                    <button
                        onClick={() => signOut(auth)}
                        className="w-full bg-red-600 text-white font-medium py-2 rounded-lg hover:bg-red-700"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>
        </>
    );
}
