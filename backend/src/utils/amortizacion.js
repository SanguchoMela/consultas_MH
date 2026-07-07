import {
  parseFechaDMY,
  calcularDiasMora,
  calcularInteresMoraPorCuota,
} from "./mora.js";

export const sumarMeses = (fecha, meses) => {
  const f = new Date(fecha);
  f.setMonth(f.getMonth() + meses);
  return f;
};

export const formatearFecha = (fecha) => {
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
  ultimoValorPagado,
  ultimaCuotaPagada = 0,
  tasaMora
}) => {

  const tabla = [];
  let saldo = Number(saldoInicial);
  const cuotaBase = Number(valorCuota);

  const fechaBase = parseFechaDMY(fechaPrimeraCuota);

  for (let i = 0; i < meses; i++) {
    const fechaCuota = sumarMeses(fechaBase, i);
    const diasMora = calcularDiasMora(formatearFecha(fechaCuota));

    const valorCuotaAjustado =
      i === 0 && Number(ultimoValorPagado) < cuotaBase
        ? Math.max(0, cuotaBase - Number(ultimoValorPagado))
        : cuotaBase;

    const interes = calcularInteresMoraPorCuota(
      valorCuotaAjustado,
      tasaMora,
      diasMora,
    );
    const totalPagar = valorCuotaAjustado + interes;

    saldo -= totalPagar;
    if (saldo < 0) saldo = 0;

    tabla.push({
      cuota: Number(ultimaCuotaPagada) + i + 1,
      fecha: formatearFecha(fechaCuota),
      diasMora,
      valorCuota: cuotaBase,
      valorCuotaAjustado,
      interes,
      totalPagar: Number(totalPagar.toFixed(2)),
      saldo: Number(saldo.toFixed(2)),
    });
  }

  return tabla;
};
