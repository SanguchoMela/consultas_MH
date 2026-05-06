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
            totalPorComprobante: pago.totalPorComprobante
        })),
        totalPagado: pagosObj.totalPagado
      };
    default:
      return {};
  }
};
