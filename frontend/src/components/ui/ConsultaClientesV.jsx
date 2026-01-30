import { useState } from "react";
import BuscadorClientes from "./BuscadorClientes";
import Spinner from "../Spinner";

export default function ConsultaClientesV() {
    const [resultados, setResultados] = useState([])
    const [loading, setLoading] = useState(false)

    return (
        <>
            <BuscadorClientes onResultados={(data) => setResultados(data)} loading={loading} setLoading={setLoading} />
            {loading && <Spinner />}

            <div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resultados.length > 0 ? (
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