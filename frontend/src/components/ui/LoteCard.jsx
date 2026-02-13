import FlujoPagos from "./FlujoCaja"
import { generarPdfLote } from "../../utils/generarPdfLote"
import { useState } from "react"
import Spinner from "../feedback/Spinner"

export default function LoteCard({ lote, cliente, backendUrl }) {
    const [loadingPdf, setLoadingPdf] = useState(null)
    const [error, setError] = useState(false)

    const handleGenerarPdf = async (cliente, lote) => {
        try {
            setLoadingPdf(lote._id)
            await generarPdfLote(cliente, lote, backendUrl)
        } catch (error) {
            setError("No se pudo generar el PDF")
        } finally {
            setLoadingPdf(null)
        }
    }
    return (
        <div key={lote._id} className="relative border border-cyan-700 p-4 rounded w-full">
            <button
                onClick={() => handleGenerarPdf(cliente, lote)}
                disabled={loadingPdf === lote._id}
                className={`absolute top-1 right-2 z-10 cursor-pointer bg-gray-200 shadow-md shadow-cyan-900/50 p-2 rounded
                    ${loadingPdf === lote._id} ? "cursor-not-allowed opacity-70" : "hover:bg-gray-300"
                `}
            >
                {loadingPdf === lote._id ? (
                    <Spinner overlay />
                ) : (
                    <img src="/pdf.png" alt="Descargar PDF" className="w-5" />
                )}
            </button>
            {/* Información del lote */}
            <table className="w-full">
                <caption className="caption-style">Información del lote</caption>
                <tbody>
                    <tr className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 px-2">
                        {/* COLUMNA 1 */}
                        <td>
                            <table className="w-full">
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
                                </tbody>
                            </table>
                        </td>
                        {/* COLUMNA 2 */}
                        <td>
                            <table className="w-full">
                                <tbody>
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
                        </td>
                    </tr>
                </tbody>
            </table>
            {/* Estado de cuenta del lote */}
            <table className="w-full mt-2">
                <tbody>
                    <tr className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 px-2">
                        <td>
                            <table className="w-full">
                                <tbody>
                                    <tr className="tr-style">
                                        <td className="sub-label">Valor pagado</td>
                                        <td>{lote.estadoCuenta.valorpagado}</td>
                                    </tr>
                                    <tr className="tr-style">
                                        <td className="sub-label">Valor por pagar</td>
                                        <td>{lote.estadoCuenta.valorporpagar}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table className="w-full">
                                <tbody>
                                    <tr className="tr-style">
                                        <td className="sub-label">Valor vigente</td>
                                        <td className="text-green-600">{lote.estadoCuenta.valorvigente}</td>
                                    </tr>
                                    <tr className="tr-style">
                                        <td className="sub-label">Valor vencido</td>
                                        <td className="text-red-600">{lote.estadoCuenta.valorvencido}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <FlujoPagos lote={lote.infoLote.lote} manzana={lote.infoLote.manzana} backUrl={backendUrl} />
        </div>
    )
}