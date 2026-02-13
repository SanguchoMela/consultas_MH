import { useState } from "react";
import { auth } from "../../firebase";
import ErrorCard from "../feedback/ErrorCard";

export default function BuscadorClientes({ onResultados, loading, setLoading }) {
    const [nombre, setNombre] = useState("");
    const [cedula, setCedula] = useState("");
    const [error, setError] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const hideLoading = () => setLoading(false)

    const showError = (message) => {
        setError(message);
        hideLoading()
    }

    const buscarCliente = async (e) => {
        e.preventDefault()
        setError(null);
        setLoading(true)

        const ci = cedula.trim();
        const nom = nombre.trim();

        if (!ci && !nom) return showError("Ingrese el nombre o la cédula del cliente");

        // Priorizar búsqueda por cédula si ambos campos están llenos
        let url = "";

        if (ci) {
            url = `${backendUrl}/api/buscar-cedula?cedula=${ci}`;
        } else {
            url = `${backendUrl}/api/buscar-nombre?nombre=${nom}`;
        }

        try {
            // Obtener token del usuario autenticado
            const user = auth.currentUser;
            if (!user) {
                return showError("Usuario no autenticado. Por favor, inicie sesión.");
            }

            const token = await user.getIdToken();

            // Realizar la solicitud con el token en el encabezado
            const res = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            const data = await res.json();

            if (!res.ok) return showError(data.error || "Error en la búsqueda")

            if (!data.length) return showError("No se encontró información del cliente");

            onResultados(data)
        } catch (error) {
            onResultados([])
            showError("Error de conexión con el servidor");
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {error && <ErrorCard errorMessage={error} />}

            <form onSubmit={buscarCliente} className="w-full lg:w-[60%] mx-auto">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col bg-white rounded-lg py-3 px-4 w-full">
                        <label className="sub-label">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ej. Maria Perez"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            aria-label="Campo para nombre del cliente"
                            className="input-style"
                        />
                    </div>
                    <div className="flex flex-col bg-white rounded-lg py-3 px-4 w-full">
                        <label className="sub-label">Cédula de identidad</label>
                        <input
                            type="text"
                            placeholder="Ej. 1799999999"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            aria-label="Campo para cédula de identidad del cliente"
                            className="input-style"
                        />
                    </div>
                </div>
                <button
                    disabled={loading}
                    className="search-button w-full mt-3"
                >
                    {loading ? "Buscando..." : "Buscar Cliente"}
                </button>
            </form>
        </>
    )
}