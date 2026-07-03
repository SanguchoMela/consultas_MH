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
    if (!pagos?.length) return 0

    return Number(pagos[0]?.detalles?.[0]?.valorPagado || 0);
};