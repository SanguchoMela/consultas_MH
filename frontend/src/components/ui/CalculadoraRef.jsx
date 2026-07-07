import { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Header from "../layout/Header";

export default function CalculadoraRef({ estadoCuenta, cliente, lote }) {
  const [tasa, setTasa] = useState(4.99);
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Refinanciamiento",
  });

  const { carteraVencida, carteraVigente } = useMemo(() => {
    const vencida = [];
    const vigente = [];

    lote?.tablaAmortizacion?.forEach((fila) => {
      if (fila.diasMora > 0) {
        vencida.push(fila);
      } else {
        vigente.push(fila);
      }
    });

    return {
      carteraVencida: vencida,
      carteraVigente: vigente,
    };
  }, [lote]);

  const renderTabla = (datos, title, esVencida = false) => (
    <table className="min-w-full table-auto shadow-md text-sm">
      <caption
        className={
          esVencida ? "font-medium bg-amber-500 py-2" : "caption-style"
        }
      >
        {title}
      </caption>
      <thead>
        <tr className="sub-label">
          <th
            className={
              esVencida
                ? "px-4 py-1 text-left bg-amber-300/50"
                : "table-fc-label"
            }
          >
            Cuota
          </th>
          <th
            className={
              esVencida
                ? "px-4 py-1 text-left bg-amber-300/50"
                : "table-fc-label"
            }
          >
            Fecha
          </th>
          <th
            className={
              esVencida
                ? "px-4 py-1 text-left bg-amber-300/50"
                : "table-fc-label"
            }
          >
            Días mora
          </th>
          <th
            className={
              esVencida
                ? "px-4 py-1 text-left bg-amber-300/50"
                : "table-fc-label"
            }
          >
            Valor cuota
          </th>
          <th
            className={
              esVencida
                ? "px-4 py-1 text-left bg-amber-300/50"
                : "table-fc-label"
            }
          >
            Interés
          </th>
          <th
            className={
              esVencida
                ? "px-4 py-1 text-left bg-amber-300/50"
                : "table-fc-label"
            }
          >
            Total a pagar
          </th>
          <th
            className={
              esVencida
                ? "px-4 py-1 text-left bg-amber-300/50"
                : "table-fc-label"
            }
          >
            Saldo
          </th>
        </tr>
      </thead>

      <tbody>
        {datos.map((fila, index) => (
          <tr
            key={index}
            className={
              esVencida
                ? "bg-amber-50 text-red-700"
                : "border-t border-gray-200"
            }
          >
            <td className="table-fc-sublabel">{fila.cuota}</td>
            <td className="table-fc-sublabel">{fila.fecha}</td>
            <td className="table-fc-sublabel">{fila.diasMora}</td>
            <td className="table-fc-sublabel">
              {Number(fila.valorCuotaAjustado).toFixed(2)}
            </td>
            <td className="table-fc-sublabel">
              {Number(fila.interes).toFixed(2)}
            </td>
            <td className="table-fc-sublabel">
              {Number(fila.totalPagar).toFixed(2)}
            </td>
            <td className="table-fc-sublabel">
              {Number(fila.saldo).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
      {esVencida && (
        <tfoot>
          <tr className="bg-gray-200 font-bold text-black">
            <td colSpan="3" className="text-center py-2">
              TOTALES
            </td>

            <td className="px-2">${lote.estadoCuenta.totalValorCuotas}</td>

            <td className="px-2">${lote.estadoCuenta.totalInteres}</td>

            <td className="px-2">${lote.estadoCuenta.totalPagar}</td>

            <td></td>
          </tr>
        </tfoot>
      )}
    </table>
  );

  return (
    <>
      <button
        onClick={handlePrint}
        className="mb-1 w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg border border-gray-300 hover:border-cyan-900 hover:border-2"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17 7H7V6h10v1zm0 12H7v-6h10v6zm2-12V3H5v4H1v8.996C1 17.103 1.897 18 3.004 18H5v3h14v-3h1.996A2.004 2.004 0 0 0 23 15.996V7h-4z"
            fill="#053345"
          />
        </svg>
      </button>

      <div ref={printRef} className="print:p-8">
        <Header title="Calculadora de Interés de Mora" />

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
              <td className="sub-label">Fecha última cuota pagada:</td>
              <td>{estadoCuenta.fechaultimacuotapagada}</td>
            </tr>
            <tr className="tr-style">
              <td className="sub-label">Porcentaje de interés (%):</td>
              <td>12</td>
            </tr>
          </tbody>
        </table>

        <p className="font-medium my-4 px-3">
          Interés generado:{" "}
          <span className="text-red-600">${estadoCuenta.totalInteres}</span>
        </p>
        <p className="border font-bold p-2 rounded-lg bg-cyan-700/10 text-center">
          Saldo a pagar:{" "}
          <span className="text-cyan-800">${estadoCuenta.totalConMora}</span>
        </p>

        <section className="px-3 mt-4">
          <h3 className="label text-cyan-900">Tabla de Amortización</h3>

          <section>
            {carteraVencida.length > 0 ? (
              renderTabla(carteraVencida, "Cartera Vencida", true)
            ) : (
              <p></p>
            )}
          </section>
          <section>
            {carteraVigente.length > 0 ? (
              renderTabla(carteraVigente, "Cartera Vigente", false)
            ) : (
              <p></p>
            )}
          </section>
        </section>
      </div>
    </>
  );
}
