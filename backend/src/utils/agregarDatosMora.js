import { generarTablaAmortizacion } from "./amortizacion.js";
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

    const totalCuotas = parseFinanciamientoMeses(lote.infoLote.financiamiento);
    const cuotasPagadasCompletas = ultimaCuotaPagada;
    const cuotasPorPagar = Math.max(0, totalCuotas - ultimaCuotaPagada);

    const cuotaPrimeraAjustada =
      ultimoValorPagado > 0 && ultimoValorPagado < cuotaBase
        ? cuotaBase - ultimoValorPagado
        : cuotaBase;

    const diasMoraBase = calcularDiasMora(
      lote.estadoCuenta.fechaultimacuotapagada,
    );

    const interesesPorCuota = Array.from({ length: cuotasPorPagar }, (_, i) =>
      calcularInteresMoraPorCuota(
        i === 0 ? cuotaPrimeraAjustada : cuotaBase,
        TASA_MORA,
        diasMoraBase,
        i + 1,
      ),
    );

    // Total interés
    const interesMora = interesesPorCuota.reduce((a, b) => a + b, 0);

    const totalConMora = calcularTotalConMora(
      lote.estadoCuenta.valorporpagar,
      interesMora,
    );

    const valorCuotaConMora = calcularCuotaConMora(
      totalConMora,
      cuotasPorPagar,
    );

    const fechaPrimeraCuota =
      lote.estadoCuenta.fechaPrimeraCuota ||
      lote.estadoCuenta.fechaultimacuotapagada;

    const tablaAmortizacion = generarTablaAmortizacion({
      fechaPrimeraCuota,
      meses: cuotasPorPagar,
      valorCuota: cuotaBase,
      interesesPorCuota,
      saldoInicial: totalConMora,
      ultimoValorPagado,
      ultimaCuotaPagada,
      tasaMora: TASA_MORA,
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

        diasMora: diasMoraBase,
        interesMora: Number(interesMora.toFixed(2)),
        interesesPorCuota: interesesPorCuota.map((i) => Number(i.toFixed(2))),

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
