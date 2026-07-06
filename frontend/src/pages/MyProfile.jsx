import { useState } from "react";
import { useAuth } from "../context/authContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../components/layout/Header";

export default function MyProfile() {
    const { cambiarPassword } = useAuth()

    const [passwordActual, setPasswordActual] = useState("")
    const [nuevaPassword, setNuevaPassword] = useState("")

    const [mostrarPassActual, setMostrarPassActual] = useState(false)
    const [mostrarPassNueva, setMostrarPassNueva] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validaciones antes de enviar solicitud a Firebase
        if (nuevaPassword.length < 6) {
            alert("La contraseña debe tener mínimo 6 caractéres")
            return
        }

        if (passwordActual === nuevaPassword) {
            alert("La nueva contraseña debe ser diferente")
            return
        }

        try {
            await cambiarPassword(passwordActual, nuevaPassword)
            alert("Contraseña actualizada correctamente")
        } catch (error) {
            console.error(error)

            switch (error.code) {
                case "auth/requires-recent-login":
                    alert("Por seguridad debes iniciar sesión nuevamente antes de cambiar la contraseña")
                    break;
                case "auth/wrong-password":
                    alert("La contraseña actual es incorrecta")
                    break;
                case "auth/weak-password":
                    alert("La nueva contraseña es demasiado débil")
                    break;
                case "auth/too-many-requests":
                    alert("Demasiados intentos. Intenta más tarde.");
                    break;

                default:
                    alert("Ocurrió un error: " + error.message);
            }
        }
    }

    return (
        <>
            <Header title="Mi Perfil" />
            <p className="font-semibold text-lg mb-2 text-cyan-900">Actualizar contraseña</p>
            <form onSubmit={handleSubmit} className="lg:max-w-[50%] md:max-w-[70%] mx-auto mt-2 space-y-2">
                <div>
                    <label className="sub-label">Contraseña actual</label>
                    <div className="flex items-center">
                        <input
                            type={mostrarPassActual ? "text" : "password"}
                            value={passwordActual}
                            onChange={(e) => setPasswordActual(e.target.value)}
                            placeholder="Contraseña actual"
                            className="input-style block w-full"
                            required
                        />
                        <button
                            className="px-4 py-2 text-cyan-900/70 hover:text-cyan-900 border-b"
                            type="button"
                            onClick={() => setMostrarPassActual(prev => !prev)}
                        >
                            {mostrarPassActual ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="sub-label">Nueva contraseña</label>
                    <div className="flex items-center">
                        <input
                            type={mostrarPassNueva ? "text" : "password"}
                            value={nuevaPassword}
                            onChange={(e) => setNuevaPassword(e.target.value)}
                            placeholder="Nueva contraseña"
                            className="input-style block w-full"
                            required
                        />
                        <button
                            className="px-4 py-2 text-cyan-900/70 hover:text-cyan-900 border-b"
                            type="button"
                            onClick={() => setMostrarPassNueva(prev => !prev)}
                        >
                            {mostrarPassNueva ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                <button type="submit" className="search-button w-full mt-3">Cambiar contraseña</button>
            </form >
        </>
    )
}