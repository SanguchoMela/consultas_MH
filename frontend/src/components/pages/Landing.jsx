import { useState } from "react"

export default function Landing() {
    const [showSection, setShowSection] = useState(false)
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
            <nav className="h-13 fixed w-full z-50 backdrop-blur-md">
                <ul className="flex justify-end items-center py-4 px-8">
                    {/* <li className="font-semibold text-lg">Manta Hills</li> */}
                    <li>
                        <button className="px-3 py-2 bg-cyan-800 hover:bg-cyan-900 text-white font-medium text-sm rounded-lg">Iniciar Sesión</button>
                    </li>
                </ul>
            </nav>
            <main className="flex items-center justify-center min-h-[calc(100vh-56px)]">
                {!showSection ? (
                    <section className="flex flex-col items-center">
                        <img src="/mh.png" alt="Logo Manta Hills" className="w-96" />
                        {/* <button
                            onClick={() => setShowSection(true)}
                            className="py-3 px-4 mt-10 text-white text-lg font-semibold rounded-xl bg-cyan-900">Consulta tu lote
                        </button> */}
                    </section>
                ) : (
                    <section className="flex flex-col items-center w-full">
                        <div className="">
                            <img src="/mh.png" alt="Logo Manta Hills" className="w-48" />
                        </div>
                        <div className="text-center my-4">
                            <h2 className="font-semibold text-xl">Busca tu lote</h2>
                            <p className="text-sm mt-1">Ingresa tu nombre o tu número de cédula para ver la información de tu lote</p>
                        </div>

                        <form>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col bg-white rounded-lg py-3 px-4">
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
                                <div className="flex flex-col bg-white rounded-lg py-3 px-4">
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
                        {/* <button
                                onClick={() => setShowSection(false)}
                                className="py-1 px-3 mt-2 text-white text-sm font-semibold rounded-xl bg-cyan-900">
                                Regresar
                            </button> */}
                        <div className="w-full my-5 flex justify-center">
                            {Array.isArray(resultados) && resultados.length > 0 && (
                                resultados.map((cliente) => (
                                    <div key={cliente._id} className="w-[40%]">
                                        <p className="bg-cyan-800 text-white text-center py-2 font-medium">{cliente.datosPersonales.nombrecliente}</p>
                                        {cliente.lotes.lenght === 0 ? (
                                            <p>El cliente que ingresaste no tiene lotes asociados</p>
                                        ) : (
                                            cliente.lotes.map((lote) => (
                                                <table key={lote._id} className="w-full border-x border-b border-cyan-900/40">
                                                    <caption className="caption-style">Información del lote</caption>
                                                    <tbody>
                                                        <tr className="tr-style">
                                                            <td className="sub-label">Etapa</td>
                                                            <td>{lote.infoLote.etapa}</td>
                                                        </tr>
                                                        <tr className="tr-style">
                                                            <td className="sub-label">Lote</td>
                                                            <td>{lote.infoLote.lote}</td>
                                                        </tr>
                                                        <tr className="tr-style">
                                                            <td className="sub-label">Manzana</td>
                                                            <td>{lote.infoLote.manzana}</td>
                                                        </tr>
                                                        <tr className="tr-style">
                                                            <td className="sub-label">Área</td>
                                                            <td>{lote.infoLote.area} m²</td>
                                                        </tr>
                                                        <tr className="tr-style">
                                                            <td className="sub-label">Valor m²</td>
                                                            <td>{lote.infoLote.valorm2}</td>
                                                        </tr>
                                                        <tr className="tr-style">
                                                            <td className="sub-label">Valor total</td>
                                                            <td>{lote.infoLote.valortotal}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            ))
                                        )}
                                    </div>
                                ))

                            )}
                        </div>
                    </section>
                )}
            </main>
        </>
    )
}