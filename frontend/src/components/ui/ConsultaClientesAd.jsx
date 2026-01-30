import { useState } from "react";
import BuscadorClientes from "./BuscadorClientes";
import Spinner from "../Spinner";
import LoteCard from "../LoteCard";
import ClienteInfoCard from "../ClienteInfoCard";

export default function ConsultaClientesAd() {
    const [resultados, setResultados] = useState([])
    const [loading, setLoading] = useState(false)

    return (
        <>
            <BuscadorClientes onResultados={(data) => setResultados(data)} loading={loading} setLoading={setLoading} />
            {loading && <Spinner />}

            <section className=" mt-6 space-y-3">
                {resultados.length > 0 ? (
                    resultados.map((cliente) => (
                        <details key={cliente._id} className="group lg:px-6 lg:py-4 md:px-5 p-3 rounded bg-white shadow shadow-cyan-900/70">
                            <summary className="cursor-pointer list-none flex justify-between items-center">
                                <h2 className="lg:text-xl md:text-lg text-md font-semibold text-cyan-800 text-center md:text-left">
                                    {cliente.datosPersonales.nombrecliente}
                                </h2>
                                <svg
                                    className="w-7 h-7 transition-transform duration-500 group-open:rotate-180"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z"
                                        fill="#005f78"
                                    />
                                </svg>
                            </summary>

                            <hr className="text-cyan-700 mt-2" />
                            {/* Datos del cliente */}
                            <ClienteInfoCard cliente={cliente} />

                            {/* Lotes asociados al cliente */}
                            <h3 className="text-lg font-semibold mt-3 mb-1">Lotes</h3>

                            <div className={`grid gap-4 ${cliente.lotes.length === 1 ? 'place-items-center' : 'lg:grid-cols-2'
                                }`}>
                                {cliente.lotes.length === 0 ? (
                                    <p>Sin lotes asociados</p>
                                ) : (
                                    cliente.lotes.map((lote) => (
                                        <LoteCard key={lote._id} lote={lote} cliente={cliente} />
                                    ))
                                )}
                            </div>
                        </details >
                    ))
                ) : (
                    <p className="text-center mt-5">Haz una búsqueda</p>
                )}
            </section>
        </>
    )
}