import { useState } from "react";
import ErrorCard from "../ErrorCard";

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
            url = `${backendUrl}/buscar-cedula?cedula=${ci}`;
        } else {
            url = `${backendUrl}/buscar-nombre?nombre=${nom}`;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok) return showError(data.error || "Error en la búsqueda")

            if (!data.length) return showError("No se encontró información del cliente");

            onResultados(data)
        } catch (error) {
            onResultados([])
            showError(error.message || "Error en conexión con el servidor");
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
                    className="text-white font-medium w-full mt-3 lg:px-5 px-4 lg:py-2 py-1 rounded-lg bg-cyan-800 hover:bg-cyan-900"
                >
                    {loading ? "Buscando..." : "Buscar Cliente"}
                </button>
            </form>
        </>
    )
}