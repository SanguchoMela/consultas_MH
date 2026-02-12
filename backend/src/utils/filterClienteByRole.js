export const filtrarClientePorRol = (cliente, role) => {
  switch(role) {
    case "admin":
      return cliente;
    case "supervisor":
      return {
        _id: cliente._id,
        datosPersonales: {
          nombrecliente: cliente.datosPersonales.nombrecliente,
          ci: cliente.datosPersonales.ci,
        },
        lotes: cliente.lotes
      };
    case "seller":
      return {
        _id: cliente._id,
        datosPersonales: {
          nombrecliente: cliente.datosPersonales.nombrecliente,
        },
        lotes: cliente.lotes.map(lote => ({
          _id: lote._id,
          manzana: lote.infoLote.manzana,
          lote: lote.infoLote.lote,
        }))
      };
    default:
      return {};
  }
};