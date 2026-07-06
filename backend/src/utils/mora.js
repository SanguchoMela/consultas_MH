export const parseFechaDMY = (fecha) => {
    if (!fecha) return null;

    const [d, m, y] = String(fecha).split("/");
    return new Date(Number(y), Number(m) - 1, Number(d));
};

export const calcularDiasMora = (fecha) => {
    const f = parseFechaDMY(fecha);
    if (!f) return 0;

    const fechaCorte = new Date(2026, 6, 31); // 31 de julio de 2026
    // const hoy = new Date();
    const hoy = new Date(2026, 8, 31);

    const limite = hoy > fechaCorte ? fechaCorte : hoy;

    // Ignorar la hora para evitar diferencias por huso horario
    const fechaInicio = new Date(f.getFullYear(), f.getMonth(), f.getDate());
    const fechaFin = new Date(
        limite.getFullYear(),
        limite.getMonth(),
        limite.getDate()
    );

    const MS_POR_DIA = 1000 * 60 * 60 * 24;

    const dias = Math.floor((fechaFin - fechaInicio) / MS_POR_DIA);

    return Math.max(0, dias);
};

// export const calcularDiasMora = (fecha) => {
//     const f = parseFechaDMY(fecha);
//     if (!f) return 0;

//     const fechaCorte = new Date(2026, 5, 30)

//     const hoy = new Date();

//     const limite = hoy > fechaCorte ? fechaCorte : hoy;

//     let anios = limite.getFullYear() - f.getFullYear();
//     let meses = limite.getMonth() - f.getMonth();
//     let dias = limite.getDate() - f.getDate();

//     if (dias < 0) {
//         dias += 30;
//         meses--;
//     }

//     if (meses < 0) {
//         meses += 12;
//         anios--;
//     }

//     return Math.max(0, anios * 360 + meses * 30 + dias);
// };

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

export const obtenerUltimaCuotaPagada = (pagos) => {
    if (!Array.isArray(pagos) || pagos.length === 0) return 0;

    let ultimaCuota = 0;

    pagos.forEach((pago) => {
        (pago.detalles || []).forEach(({ detalle }) => {
            const match = detalle.match(/\d+/);
            if (!match) return;

            const numeroCuota = Number(match[0]);
            if (numeroCuota > ultimaCuota) {
                ultimaCuota = numeroCuota;
            }
        });
    });

    return ultimaCuota;
};

export const parseFinanciamientoMeses = (financiamiento) => {
    if (!financiamiento) return 0;

    const texto = String(financiamiento).toLowerCase().trim();

    if (texto.includes("contado")) return 0;

    const match = texto.match(/(\d+)\s*meses?/);
    if (!match) return 0;

    return Number(match[1]);
};

export const calcularTotalCuotas = (cuotas = []) =>
    cuotas
        .filter((c) => Number(c.diasMora) > 0)
        .reduce((total, cuota) => total + (Number(cuota.valorCuotaAjustado) || 0), 0);

export const calcularTotalInteres = (cuotas = []) =>
    cuotas
        .filter((c) => Number(c.diasMora) > 0)
        .reduce((total, cuota) => total + (Number(cuota.interes) || 0), 0);

export const calcularTotalConInteres = (cuotas = []) =>
    cuotas
        .filter((c) => Number(c.diasMora) > 0)
        .reduce((total, cuota) => total + (Number(cuota.totalPagar) || 0), 0);