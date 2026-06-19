import FlujoPagos from "./FlujoCaja"
import { useState } from "react"
import CalculadoraRef from "./CalculadoraRef"
import Spinner from "../feedback/Spinner"
import InfoTable from "./InfoTable"

export default function LoteCard({
    lote,
    cliente,
    backendUrl,
    showPdfButton = true,
    showFlujoPagos = true
}) {
    const [loadingPdf, setLoadingPdf] = useState(null)
    const [error, setError] = useState(false)
    const [showCalculadora, setShowCalculadora] = useState(false)

    const handleGenerarPdf = async (cliente, lote) => {
        try {
            setLoadingPdf(lote._id)
            setError(false)

            const res = await fetch(`${backendUrl}/api/generar-pdf/${cliente._id}/${lote._id}`)

            if (!res.ok) {
                throw new Error("Error generando PDF")
            }

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)

            const a = document.createElement("a")
            a.href = url
            a.download = `EC_${lote.infoLote.lote}${lote.infoLote.manzana}`
            a.click()

            window.URL.revokeObjectURL(url)
        } catch (err) {
            setError("No se pudo generar el PDF")
        } finally {
            setLoadingPdf(null)
        }
    }

    const infoLoteCol1 = [
        { label: "Etapa", value: lote.infoLote?.etapa },
        { label: "Lote", value: lote.infoLote?.lote },
        { label: "Manzana", value: lote.infoLote?.manzana },
    ].filter(row => row.value != null)

    const infoLoteCol2 = [
        { label: "Área", value: lote.infoLote?.area ? `${lote.infoLote.area} m²` : null },
        { label: "Valor m²", value: lote.infoLote?.valorm2 },
        { label: "Valor total", value: lote.infoLote?.valortotal }
    ].filter(row => row.value != null)

    const estadoCuentaCol1 = [
        { label: "Valor pagado", value: lote.estadoCuenta?.valorpagado },
        { label: "Valor por pagar", value: lote.estadoCuenta?.valorporpagar },
    ].filter(row => row.value != null)

    const estadoCuentaCol2 = [
        { label: "Valor vigente", value: lote.estadoCuenta?.valorvigente, className: "text-green-600" },
        { label: "Valor vencido", value: lote.estadoCuenta?.valorvencido, className: "text-red-600" }
    ].filter(row => row.value != null)

    const tieneEstadoCuenta = estadoCuentaCol1.length > 0 || estadoCuentaCol2.length > 0

    return (
        <div key={lote._id} className="relative border border-cyan-700 p-4 rounded w-full">
            {showPdfButton && cliente && backendUrl && (
                <button
                    onClick={() => handleGenerarPdf(cliente, lote)}
                    disabled={loadingPdf === lote._id}
                    className={`absolute top-1 right-2 z-10 cursor-pointer bg-gray-200 hover:bg-gray-300 shadow-md shadow-cyan-900/50 p-2 rounded
                    ${loadingPdf === lote._id ? "cursor-not-allowed opacity-70" : ""}
                `}
                >
                    {loadingPdf === lote._id ? (
                        <Spinner size="sm" color="text-red-600" />
                    ) : (
                        <img src="/pdf.png" alt="Descargar PDF" className="w-5" />
                    )}
                </button>
            )}
            {/* Información del lote */}
            <table className="w-full">
                <caption className="caption-style">Información del lote</caption>
                <tbody>
                    <tr className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 px-2">
                        <td><InfoTable rows={infoLoteCol1} /></td>
                        <td><InfoTable rows={infoLoteCol2} /></td>
                    </tr>
                </tbody>
            </table>
            {/* Estado de cuenta del lote */}
            {tieneEstadoCuenta && (
                <>
                    <table className="w-full mt-2">
                        <tbody>
                            <tr className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 px-2">
                                <td><InfoTable rows={estadoCuentaCol1} /></td>
                                <td><InfoTable rows={estadoCuentaCol2} /></td>
                            </tr>
                        </tbody>
                    </table>
                    {Number(lote.estadoCuenta.valorvencido) > 0 && (
                        <div className="text-right mt-2">
                            <button onClick={() => setShowCalculadora(true)}
                                className="search-button">
                                Interés de mora
                            </button>
                        </div>
                    )}
                </>
            )}
            {/* Error PDF */}
            {error && <p className="text-red-600 mt-2">{error}</p>}
            {showCalculadora && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[95vh] overflow-y-auto relative">

                        <button
                            onClick={() => setShowCalculadora(false)}
                            className="absolute top-3 right-4 text-gray-600 hover:text-gray-900 text-xl hover:font-bold "
                        >
                            ✕
                        </button>

                        <CalculadoraRef
                            estadoCuenta={lote.estadoCuenta}
                        />
                    </div>
                </div>
            )}
            {/* Flujo de pagos */}
            {showFlujoPagos && lote.infoLote?.lote && lote.infoLote?.manzana && (
                <FlujoPagos lote={lote.infoLote.lote} manzana={lote.infoLote.manzana} backUrl={backendUrl} />
            )}
        </div>
    )
}