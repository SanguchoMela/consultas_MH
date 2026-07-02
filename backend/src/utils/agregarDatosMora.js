import { generarTablaAmortizacion } from "./amortizacion.js";
import {
    calcularDiasMora,
    calcularInteresMoraPorCuota,
    calcularTotalConMora,
    calcularCuotaConMora
} from "./mora.js";

const TASA_MORA = 4.99;

export const agregarDatosMora = (cliente) => {

    cliente.lotes = cliente.lotes.map(lote => {

        const cuotasPorPagar = Number(lote.estadoCuenta.dividendosporpagar);
        const valorCuota = Number(lote.infoLote.valorcuota);

        const diasMoraBase = calcularDiasMora(
            lote.estadoCuenta.fechaultimacuotapagada
        );

        const interesesPorCuota = Array.from(
            { length: cuotasPorPagar },
            (_, i) =>
                calcularInteresMoraPorCuota(
                    valorCuota,
                    TASA_MORA,
                    diasMoraBase,
                    i + 1
                )
        );

        const interesMora = interesesPorCuota.reduce(
            (a, b) => a + b,
            0
        );

        const totalConMora = calcularTotalConMora(
            lote.estadoCuenta.valorporpagar,
            interesMora
        );

        const valorCuotaConMora = calcularCuotaConMora(
            totalConMora,
            cuotasPorPagar
        );

        const fechaPrimeraCuota = lote.estadoCuenta.fechaPrimeraCuota
            || lote.estadoCuenta.fechaultimacuotapagada;

        const tablaAmortizacion = generarTablaAmortizacion({
            fechaPrimeraCuota,
            meses: cuotasPorPagar,
            valorCuota,
            interesesPorCuota,
            saldoInicial: totalConMora
        });

        return {
            ...lote,
            estadoCuenta: {
                ...lote.estadoCuenta,

                diasMora: diasMoraBase,
                interesMora: Number(interesMora.toFixed(2)),
                interesesPorCuota: interesesPorCuota.map(i => Number(i.toFixed(2))),

                totalConMora: Number(totalConMora.toFixed(2)),
                valorCuotaConMora: Number(valorCuotaConMora.toFixed(2)),
            },
            tablaAmortizacion
        };
    });

    return cliente;
};