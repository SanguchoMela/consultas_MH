import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const { role } = useAuth();
    const location = useLocation();
    const [open, setOpen] = useState(false)

    function translateRole(role) {
        if (role === "admin") return "Administrador";
        if (role === "supervisor") return "Supervisor";
        if (role === "seller") return "Vendedor";
        return role;
    }

    const linkClass = (path) =>
        `block py-2 px-4 mx-4 my-3 rounded-md hover:bg-cyan-900/80 hover:text-white ${location.pathname === path ? "font-semibold bg-cyan-900/80 text-white" : ""
        }`;

    useEffect(() => {
        setOpen(false)
    }, [location.pathname])

    return (
        <>
            {/* Mobile */}
            <div className={`
                md:hidden fixed top-0 py-2 px-8 z-50
                flex justify-between items-center text-white
                ${open ? "bg-none" : "bg-cyan-900/80"}
                w-full backdrop-blur-sm`
            }>
                <p className={`font-semibold text-lg transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}>Manta Hills</p>
                <button onClick={() => setOpen(!open)}
                    className="text-lg font-medium p-1 hover:bg-cyan-900 rounded-md transition-colors"
                    aria-label={open ? "Cerrar menú" : "Abrir menú"}
                >
                    {open ? "✕" : "☰"}
                </button>
            </div>

            {/* Overlay */}
            {open && (
                <div onClick={() => setOpen(false)} className="fixed inset-0 bg-gray-400/40 z-40 md:hidden" />
            )}

            {/* bg-[#b7c9d4] */}
            {/* Sidebar */}
            <aside
                className={`
                fixed md:static top-0 left-0 z-50 
                min-h-full w-64 
                bg-[#d2dde3] font-medium text-gray-900
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
                </div>
                <div className="flex flex-col text-sm items-center py-2 border-b border-cyan-900/30">
                    <p>{translateRole(role)}</p>
                </div>

                {/* Nav */}
                <nav>
                    <Link to="/lotes" className={linkClass("/lotes")}>
                        Consulta de Clientes
                    </Link>

                    <Link to="/documentos" className={linkClass("/documentos")}>
                        Documentos Importantes
                    </Link>

                    <Link to="/manuales" className={linkClass("/manuales")}>
                        Manuales de Procedimientos
                    </Link>

                    {role === "admin" && (
                        <Link to="/admin" className={linkClass("/admin")}>
                            Administración
                        </Link>
                    )}
                </nav>

                {/* <hr className="text-cyan-900/30" /> */}
                {/* Logout */}
                <div className="w-full px-4 fixed bottom-0 mb-4">
                    <button
                        onClick={() => signOut(auth)}
                        className="w-full bg-red-500 text-white font-medium py-2 rounded-md hover:bg-red-600"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>
        </>
    );
}
