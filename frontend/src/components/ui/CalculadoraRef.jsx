import { useMemo, useState } from "react";
import Header from "../layout/Header";

export default function CalculadoraRef({ estadoCuenta }) {
    const [tasa, setTasa] = useState(12.99)
    const [cuotas, setCuotas] = useState(24)
    const [mostrarTabla, setMostrarTabla] = useState(false)

    const handleCuotasChange = (e) => {
        setCuotas(Number(e.target.value))
        setMostrarTabla(false)
    }

    const parseFechaDMY = (fecha) => {
        if (!fecha) return null;

        const partes = fecha.split("/");

        if (partes.length !== 3) return null;

        const [dia, mes, anio] = partes;

        const date = new Date(anio, mes - 1, dia);

        if (isNaN(date.getTime())) return null;

        return date;
    };

    const calcularDiasMora = (fechaUltimoPago) => {
        const ultimoPago = parseFechaDMY(fechaUltimoPago);
        if (!ultimoPago) return 0;

        const hoy = new Date();

        const diffTime = hoy - ultimoPago;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0;
    };

    const interesMora = useMemo(() => {
        const valorVencido = Number(estadoCuenta.valorvencido) || 0;
        const tasaDecimal = Number(tasa) / 100;
        const diasMora = calcularDiasMora(estadoCuenta.fechaultimopago);

        return (valorVencido * tasaDecimal * diasMora) / 360;
    }, [tasa, estadoCuenta]);

    const totalConMora = useMemo(() => {
        const valorVencido = Number(estadoCuenta.valorvencido) || 0;
        const valorVigente = Number(estadoCuenta.valorvigente) || 0;

        return valorVencido + valorVigente + interesMora;
    }, [estadoCuenta, interesMora]);

    const cuotaInicial = useMemo(() => {
        return totalConMora * 0.3
    }, [totalConMora])

    const saldoFinanciado = useMemo(() => {
        return totalConMora * 0.7
    }, [totalConMora])

    const tablaAmortizacion = useMemo(() => {
        const principal = saldoFinanciado

        if (!principal || cuotas <= 0) return []

        const valorCuota = saldoFinanciado / cuotas
        let saldo = saldoFinanciado

        const tabla = []

        for (let i = 1; i <= cuotas; i++) {
            saldo -= valorCuota

            tabla.push({
                cuota: i,
                valorCuota,
                saldo: saldo < 0 ? 0 : saldo
            })
        }
        return tabla
    }, [saldoFinanciado, cuotas])

    return (
        <>
            <Header title="Calculadora de Refinanciamiento" />

            <div>
                <p className="text-sm italic mb-2">
                    Condiciones:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-4 pl-3 space-y-1">
                    <li>Se deberá cancelar como mínimo el 30% del valor total de la deuda.</li>
                    <li>La diferencia (70%) se diferirá a un máximo de 24 meses.</li>
                </ul>
            </div>

            <table className="w-full">
                <tbody>
                    <tr className="tr-style">
                        <td className="sub-label">Valor vigente:</td>
                        <td className="text-green-600">{estadoCuenta.valorvigente}</td>
                    </tr>
                    <tr className="tr-style">
                        <td className="sub-label">Valor vencido:</td>
                        <td className="text-red-600">{estadoCuenta.valorvencido}</td>
                    </tr>
                    <tr className="tr-style">
                        <td className="sub-label">Fecha del último pago:</td>
                        <td>{estadoCuenta.fechaultimopago}</td>
                    </tr>
                    <tr className="tr-style">
                        <td className="sub-label">Días de mora:</td>
                        <td>{calcularDiasMora(estadoCuenta.fechaultimopago)}</td>
                    </tr>
                    <tr className="tr-style">
                        <td className="sub-label">Porcentaje de interés (%):
                            <p className="text-xs italic text-gray-500 my-1">(valor modificable)</p>
                        </td>
                        <td>
                            <input
                                type="number"
                                inputMode="numeric"
                                value={tasa}
                                onChange={(e) => setTasa(e.target.value)}
                                className="text-center py-1 px-2 border rounded-2xl border-cyan-700 focus:outline-none"
                                placeholder="Tasa %"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <p className="font-medium my-4 px-3">
                Interés generado: <span className="text-red-600">${interesMora.toFixed(2)}</span>
            </p>
            <p className="border font-bold p-2 rounded-lg bg-cyan-700/10 text-center">
                Saldo a refinanciar:{" "}
                <span className="text-cyan-800">
                    ${totalConMora.toFixed(2)}
                </span>
            </p>

            {/* <table className="w-full mt-2">
                <tbody>
                    <tr className="tr-style">
                        <td className="sub-label">Cuota Inicial (30%):</td>
                        <td>{cuotaInicial.toFixed(2)}</td>
                    </tr>
                    <tr className="tr-style">
                        <td className="sub-label">Diferencia a financiar (70%):</td>
                        <td>{saldoFinanciado.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table> */}

            {/* <section className="px-3 mt-4">
                <h3 className="label text-cyan-900">Tabla de Amortización</h3>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <label className="sub-label mb-1">Financiamiento</label>
                        <select
                            name="cuotas"
                            id="cuotas"
                            value={cuotas}
                            onChange={handleCuotasChange}
                            className="px-3 py-2 border border-cyan-700 rounded-md focus:outline-none"
                        >
                            <option value={6}>6 meses</option>
                            <option value={12}>12 meses</option>
                            <option value={24}>24 meses</option>
                            <option value={36}>36 meses</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setMostrarTabla(true)}
                        className="search-button"
                    >
                        Generar tabla de amortización
                    </button>
                </div>

                {mostrarTabla && (
                    <table className="w-full border text-sm mt-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th >Cuota</th>
                                <th >Cuota</th>
                                <th >Saldo capital</th>
                            </tr>
                        </thead>

                        <tbody className="w-full">
                            {tablaAmortizacion.map((fila) => (
                                <tr key={fila.cuota} className="tr-style">
                                    <td className="">
                                        {fila.cuota}
                                    </td>

                                    <td className="">
                                        {fila.valorCuota.toFixed(2)}
                                    </td>

                                    <td className="">
                                        {fila.saldo.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section> */}

        </>
    )
}