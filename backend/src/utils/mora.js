export const parseFechaDMY = (fecha) => {
    if (!fecha) return null;

    const [d, m, y] = String(fecha).split("/");
    return new Date(Number(y), Number(m) - 1, Number(d));
};

export const calcularDiasMora = (fecha) => {
    const f = parseFechaDMY(fecha);
    if (!f) return 0;

    const hoy = new Date();

    let anios = hoy.getFullYear() - f.getFullYear();
    let meses = hoy.getMonth() - f.getMonth();
    let dias = hoy.getDate() - f.getDate();

    if (dias < 0) {
        dias += 30;
        meses--;
    }

    if (meses < 0) {
        meses += 12;
        anios--;
    }

    return Math.max(0, anios * 360 + meses * 30 + dias);
};

// interés por cuota individual
export const calcularInteresMoraPorCuota = (
    valorCuota,
    tasa,
    diasMoraBase,
    numeroCuota
) => {

    const cuota = Number(valorCuota) || 0;
    const t = (Number(tasa) || 0) / 100;

    const diasMora = Math.max(
        0,
        Number(diasMoraBase) - ((numeroCuota - 1) * 30)
    );

    return (cuota * t * diasMora) / 360;
};

export const calcularTotalConMora = (valor, interes) =>
    Number(valor || 0) + Number(interes || 0);

export const calcularCuotaConMora = (total, cuotas) =>
    Number(total || 0) / Number(cuotas || 1);

export const obtenerUltimoPagoCuota = (pagos) => {
    if (!Array.isArray(pagos) || pagos.length === 0) return 0

    let ultimaCuota = 0
    let totalUltimaCuota = 0

    pagos.forEach((pago) => {
        (pago.detalles || []).forEach(({ detalle, valorPagado }) => {
            // Extrae el número de la cuota
            const match = detalle.match(/\d+/)
            if (!match) return

            const numeroCuota = Number(match[0])
            const valor = Number(valorPagado || 0)

            if (numeroCuota > ultimaCuota) {
                ultimaCuota = numeroCuota
                totalUltimaCuota = valor
            } else if (numeroCuota === ultimaCuota) {
                totalUltimaCuota += valor
            }
        })
    });
    return totalUltimaCuota
}