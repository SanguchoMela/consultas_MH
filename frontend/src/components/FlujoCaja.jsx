import { useEffect, useState } from "react"

const FlujoPagos = ({ lote, manzana, backUrl }) => {
    const loteBuscar = lote + manzana
    const [flujo, setFlujo] = useState(null)

    console.log(backUrl)

    const formatDateUTC = (dateString) => {
        const date = new Date(dateString);

        const dia = String(date.getUTCDate()).padStart(2, '0');
        const mes = String(date.getUTCMonth() + 1).padStart(2, '0'); // Meses empiezan desde 0
        const año = date.getUTCFullYear();

        return `${dia}/${mes}/${año}`;
    };

    useEffect(() => {
        if (!lote) return

        const fetchPagos = async () => {
            try {
                const res = await fetch(`${backUrl}/pagos/${loteBuscar}`)
                const data = await res.json()

                setFlujo(data)
            } catch (error) {
                console.error("Error al obtener los pagos:", error)
                setFlujo(null)
            }
        }

        fetchPagos()
    }, [lote])

    if (!lote) return null
    if (!flujo || !flujo[0] || !flujo[0].pagos || flujo[0].pagos.length === 0) return <p></p>;

    // Ordenar los detalles de cada pago por el número de la cuota
    flujo[0].pagos.forEach(pago => {
        if (pago.detalles && Array.isArray(pago.detalles)) {
            pago.detalles.sort((a, b) => {
                // Extraer el número de la cuota de la cadena de texto
                const cuotaA = parseInt(a.detalle.split(' ')[1])
                const cuotaB = parseInt(b.detalle.split(' ')[1])
                return cuotaB - cuotaA
            })
        }
    })

    return (
        <article>
            <details className="group" onToggle={(e) =>
                e.currentTarget.classList.toggle("open", e.currentTarget.open)
            }>
                <summary className="font-medium text-cyan-900 border-b border-cyan-700 mt-3 px-5 flex justify-between items-center cursor-pointer list-none">
                    <h4>Flujo de Caja</h4>

                    <svg
                        className="w-7 h-7 transition-transform duration-500 group-[.open]:rotate-180"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z"
                            fill="#005f78"
                        />
                    </svg>
                </summary>
                <div className="hidden md:block max-h-[70vh] overflow-y-auto">
                    <table className="min-w-full table-auto shadow-md text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr className="sub-label">
                                <th className="table-fc-label">Fecha de pago</th>
                                <th className="table-fc-label">Valor pagado</th>
                                <th className="table-fc-label">Forma de pago</th>
                                <th className="table-fc-label">Detalle del pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flujo[0].pagos.map((pago, index) => (
                                <tr key={index} className="border-t border-gray-200">
                                    <td className="table-fc-sublabel">{formatDateUTC(pago.fechaPago)}</td>
                                    <td className="table-fc-sublabel">$ {pago.totalPorFecha}</td>
                                    <td className="table-fc-sublabel">{pago.formaPago}</td>
                                    <td className="table-fc-sublabel">
                                        <ul>
                                            {pago.detalles.map((d, i) => (
                                                <li key={i}>{d.detalle}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Mobile view */}
                <div className="block md:hidden mt-2 space-y-2 max-h-[70vh] overflow-y-auto">
                    {flujo[0].pagos.map((pago, index) => (
                        <div
                            key={index}
                            className="rounded-lg border border-gray-200 shadow-sm p-3 bg-white"
                        >
                            <div className="card-pagos-label">
                                <span className="sub-label">Fecha de pago</span>
                                <span>
                                    {formatDateUTC(pago.fechaPago)}
                                </span>
                            </div>
                            <div className="card-pagos-label">
                                <span className="sub-label">Valor pagado</span>
                                <span>$ {pago.totalPorFecha}</span>
                            </div>
                            <div className="card-pagos-label">
                                <span className="sub-label">Forma de pago</span>
                                <span className="text-sm">
                                    {pago.formaPago}
                                </span>
                            </div>
                            <div className="card-pagos-label">
                                <p className="sub-label">Detalle del pago</p>
                                <ul className="list-none text-sm space-y-1 text-">
                                    {pago.detalles.map((d, i) => (
                                        <li key={i}>{d.detalle}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </details>
        </article>
    )
}

export default FlujoPagos