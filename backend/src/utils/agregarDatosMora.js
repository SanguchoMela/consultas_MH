import {
  formatearFecha,
  generarTablaAmortizacion,
} from "./amortizacion.js";
import {
  calcularDiasMora,
  calcularInteresMoraPorCuota,
  calcularTotalConMora,
  calcularCuotaConMora,
  obtenerUltimoPagoCuota,
  obtenerUltimaCuotaPagada,
  parseFinanciamientoMeses,
  calcularTotalCuotas,
  calcularTotalInteres,
  calcularTotalConInteres,
  parseFechaDMY,
  generarFechaCuota,
} from "./mora.js";

const TASA_MORA = 12;

export const agregarDatosMora = (cliente, pagosDocs) => {
  cliente.lotes = cliente.lotes.map((lote) => {
    const cuotaBase = Number(lote.infoLote.valorcuota) || 0;

    const loteKey =
      String(lote.infoLote.lote).trim() + String(lote.infoLote.manzana).trim();

    const pagos = pagosDocs.find((p) => p.lote === loteKey)?.pagos || [];

    const ultimaCuotaPagadaRaw = obtenerUltimaCuotaPagada(pagos);
    const ultimoValorPagado = obtenerUltimoPagoCuota(pagos);

    const ultimaCuotaPagada =
      ultimoValorPagado >= cuotaBase
        ? ultimaCuotaPagadaRaw
        : Math.max(0, ultimaCuotaPagadaRaw - 1);

    const esContado =
      lote.infoLote.financiamiento === "Contado" &&
      Number(lote.estadoCuenta.dividendosporpagar) === 1;

    const totalCuotas = esContado
      ? 1
      : parseFinanciamientoMeses(lote.infoLote.financiamiento);
    const cuotasPagadasCompletas = ultimaCuotaPagada;
    const cuotasPorPagar = esContado
      ? 1
      : Math.max(0, totalCuotas - ultimaCuotaPagada);

    const cuotaPrimeraAjustada =
      ultimoValorPagado > 0 && ultimoValorPagado < cuotaBase
        ? cuotaBase - ultimoValorPagado
        : cuotaBase;

    const capitalPendiente = Number(lote.estadoCuenta.valorporpagar);

    const capitalUltimaCuota = capitalPendiente - cuotaPrimeraAjustada - (cuotasPorPagar - 2) * cuotaBase

    let capitalAsignado = 0;

    const interesesPorCuota = Array.from({ length: cuotasPorPagar }, (_, i) => {
      const fechaCuota = generarFechaCuota(
        parseFechaDMY(lote.estadoCuenta.fechaultimacuotapagada),
        i,
      );

      const diasMoraCuota = calcularDiasMora(formatearFecha(fechaCuota));

      let capitalCuota;

      if (i === 0) {
        capitalCuota = cuotaPrimeraAjustada
      } else if (i === cuotasPorPagar - 1) {
        capitalCuota = capitalUltimaCuota
      } else {
        capitalCuota = cuotaBase;
      }

      capitalAsignado += capitalCuota

      return calcularInteresMoraPorCuota(
        capitalCuota,
        TASA_MORA,
        diasMoraCuota,
      );
    });

    const interesesPorCuotaRedondeados = interesesPorCuota.map(
      (i) => Number(i.toFixed(2))
    );

    const interesMora = interesesPorCuotaRedondeados.reduce(
      (a, b) => a + b,
      0
    );

    const totalConMora = esContado
      ? Number(lote.estadoCuenta.valorporpagar) + interesMora
      : calcularTotalConMora(lote.estadoCuenta.valorporpagar, interesMora);

    const valorCuotaConMora = esContado
      ? Number(lote.estadoCuenta.valorporpagar)
      : calcularCuotaConMora(totalConMora, cuotasPorPagar);

    const fechaPrimeraCuota =
      lote.estadoCuenta.fechaPrimeraCuota ||
      lote.estadoCuenta.fechaultimacuotapagada;

    const tablaAmortizacion = generarTablaAmortizacion({
      fechaPrimeraCuota,
      meses: cuotasPorPagar,
      valorCuota: esContado
        ? Number(lote.estadoCuenta.valorporpagar)
        : cuotaBase,
      interesesPorCuota,
      saldoInicial: Number(lote.estadoCuenta.valorporpagar),
      saldoConMora: Number(totalConMora),
      ultimoValorPagado,
      ultimaCuotaPagada,
      tasaMora: TASA_MORA,
      esContado,
    });

    // Totales de la tabla de amortizacion
    const totalValorCuotas = calcularTotalCuotas(tablaAmortizacion);
    const totalInteres = calcularTotalInteres(tablaAmortizacion);
    const totalPagar = calcularTotalConInteres(tablaAmortizacion);

    if (cuotasPorPagar === 0) {
      return {
        ...lote,
        estadoCuenta: {
          ...lote.estadoCuenta,
          interesMora: 0,
          interesesPorCuota: [],
          totalConMora: Number(lote.estadoCuenta.valorporpagar || 0),
          valorCuotaConMora: 0,
        },
        tablaAmortizacion: [],
      };
    }

    return {
      ...lote,
      estadoCuenta: {
        ...lote.estadoCuenta,

        ultimoValorPagado,
        ultimaCuotaPagada,

        cuotasPagadasCompletas,
        cuotasPorPagar,

        interesMora: Number(interesMora.toFixed(2)),
        interesesPorCuota: interesesPorCuotaRedondeados,

        totalConMora: Number(totalConMora.toFixed(2)),
        valorCuotaConMora: Number(valorCuotaConMora.toFixed(2)),

        totalValorCuotas: Number(totalValorCuotas.toFixed(2)),
        totalInteres: Number(totalInteres.toFixed(2)),
        totalPagar: Number(totalPagar.toFixed(2)),
      },
      tablaAmortizacion,
    };
  });

  return cliente;
};
