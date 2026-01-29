import { useState } from "react";
import ErrorCard from "../ErrorCard";
import Spinner from "../Spinner";

export default function BuscadorV() {
    const [nombre, setNombre] = useState("");
    const [cedula, setCedula] = useState("");
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const showLoading = () => setLoading(true)
    const hideLoading = () => setLoading(false)

    const showError = (message) => {
        setError(message);
        setResultados([]);
        hideLoading()
    }

    const buscarClienteAuto = async () => {
        setError(null);
        showLoading()

        const ci = cedula.trim();
        const nom = nombre.trim();

        if (!ci && !nom) return showError("Ingrese la cédula o el nombre del cliente");

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
            hideLoading()

            if (!res.ok) return showError(data.error || "Error en la búsqueda")


            if (!data.length) return showError("No se encontró información del cliente");

            setResultados(data);
            // refScroll()
        } catch (error) {
            hideLoading()
            console.error(error);
            showError("Error en conexión con el servidor");
        }
    }
    return (
        <>
            {error && <ErrorCard errorMessage={error} />}
            <p className="mb-2">Ingresa el nombre o número de cédula del cliente para ver el lote correspondiente</p>
            <form className="w-full md:w-[60%] mx-auto">
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
                    onClick={buscarClienteAuto}
                    className="text-white font-medium w-full mt-3 lg:px-5 px-4 lg:py-2 py-1 rounded-lg bg-cyan-800 hover:bg-cyan-900"
                >
                    {loading ? "Buscando..." : "Buscar Lote"}
                </button>
            </form>
            
            {loading && <Spinner />}

            <div className="my-5 grid place-content-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(resultados) && resultados.length > 0 ? (
                    resultados.map((cliente) => (
                        <div key={cliente._id} className="w-full rounded-md shadow-md bg-white text-center px-3 py-4">
                            <p className="text-center font-medium">
                                {cliente.datosPersonales.nombrecliente}
                            </p>
                            <p className="text-sm text-gray-800 mb-2">
                                ({cliente.lotes.length} lote{cliente.lotes.length !== 1 && "s"})
                            </p>
                            {cliente.lotes.length === 0 ? (
                                <p>El cliente que ingresaste no tiene lotes asociados</p>
                            ) : (
                                cliente.lotes.map((lote, index) => (
                                    <div key={lote._id} className=" border-cyan-900/40">
                                        <p>{lote.infoLote.lote} {lote.infoLote.manzana}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    ))

                ) : (
                    <p className="text-center mt-5">Haz una búsqueda</p>
                )}
            </div>
        </>
    )
}