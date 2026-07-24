import {
  parseFechaDMY,
  calcularDiasMora,
  calcularInteresMoraPorCuota,
  generarFechaCuota
} from "./mora.js";

export const sumarMeses = (fecha, meses) => {
  const f = new Date(fecha);
  f.setMonth(f.getMonth() + meses);
  return f;
};

export const formatearFecha = (fecha) => {
  if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
    return "Fecha inválida";
  }
  const d = String(fecha.getDate()).padStart(2, "0");
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const y = fecha.getFullYear();
  return `${d}/${m}/${y}`;
};

export const generarTablaAmortizacion = ({
  fechaPrimeraCuota,
  meses,
  valorCuota,
  interesesPorCuota,
  saldoInicial,
  saldoConMora,
  ultimoValorPagado,
  ultimaCuotaPagada = 0,
  tasaMora,
  esContado,
}) => {
  const tabla = [];
  const cuotaBase = Number(valorCuota);

  const saldoCapitalInicial = Number(saldoInicial);
  let saldo = Number(saldoConMora);

  const fechaBase = parseFechaDMY(fechaPrimeraCuota);

  if (esContado) {
    const diasMora = calcularDiasMora(fechaPrimeraCuota);

    const interes = calcularInteresMoraPorCuota(
      Number(saldoInicial),
      tasaMora,
      diasMora,
    );

    return [
      {
        cuota: 1,
        fecha: fechaPrimeraCuota,
        diasMora,
        valorCuota: Number(saldoInicial),
        valorCuotaAjustado: Number(saldoInicial),
        interes: Number(interes.toFixed(2)),
        totalPagar: Number((Number(saldoInicial) + interes).toFixed(2)),
        saldo: 0,
      },
    ];
  }
  // console.log("DATOS AMORTIZACION", {
  //   saldoInicial,
  //   saldoConMora,
  //   meses,
  //   valorCuota,
  //   ultimoValorPagado
  // });

  for (let i = 0; i < meses; i++) {
    // const fechaCuota = sumarMeses(fechaBase, i);
    const fechaCuota = generarFechaCuota(fechaBase, i);
    const diasMora = calcularDiasMora(formatearFecha(fechaCuota));

    let valorCuotaAjustado

    // Primera cuota con abono previo
    if (i === 0 && Number(ultimoValorPagado) < cuotaBase) {
      valorCuotaAjustado = Math.max(0, cuotaBase - Number(ultimoValorPagado));
    }
    // Última cuota calculada por diferencia
    else if (i === meses - 1) {
      const cuotasAnteriores = tabla.reduce(
        (total, cuota) =>
          total + Number(cuota.valorCuotaAjustado),
        0
      );
      valorCuotaAjustado = Number((saldoCapitalInicial - cuotasAnteriores).toFixed(2));
    }
    // Cuotas normales
    else { valorCuotaAjustado = cuotaBase; }

    const interes = calcularInteresMoraPorCuota(
      valorCuotaAjustado,
      tasaMora,
      diasMora,
    );
    const totalPagar = Number(valorCuotaAjustado + interes).toFixed(2);

    // Saldo para mostrar: resta cuota + interes
    saldo = Number((saldo - totalPagar).toFixed(2));

    if (saldo < 0) saldo = 0;

    // saldo -= totalPagar;

    tabla.push({
      cuota: Number(ultimaCuotaPagada) + i + 1,
      fecha: formatearFecha(fechaCuota),
      diasMora,
      valorCuota: cuotaBase,
      valorCuotaAjustado,
      interes,
      totalPagar,
      saldo,
    });
  }

  return tabla;
};
