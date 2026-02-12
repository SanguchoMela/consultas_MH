export const filtrarPagosPorRol = (pagosObj, role) => {
  switch (role) {
    case "admin":
      return pagosObj; // todo visible
    case "supervisor":
      return {
        _id: pagosObj._id,
        lote: pagosObj.lote,
        pagos: pagosObj.pagos.map(pago => ({
            fechaPago: pago.fechaPago,
            totalPorFecha: pago.totalPorFecha
        })),
        totalPagado: pagosObj.totalPagado
      };
    default:
      return {};
  }
};
