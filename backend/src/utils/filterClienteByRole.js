export const filtrarClientePorRol = (cliente, role) => {
  switch (role) {
    case "admin":
      return cliente;
    case "supervisor":
      return {
        _id: cliente._id,
        datosPersonales: {
          nombrecliente: cliente.datosPersonales.nombrecliente,
          ci: cliente.datosPersonales.ci
        },
        datosContacto: {
          email: cliente.datosContacto.email,
          telefono: cliente.datosContacto.telefono
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
          infoLote: {
            etapa: lote.infoLote.etapa,
            manzana: lote.infoLote.manzana,
            lote: lote.infoLote.lote,
            area: lote.infoLote.area,
            valorm2: lote.infoLote.valorm2,
            valortotal: lote.infoLote.valortotal
          }
        }))
      };
    default:
      return {};
  }
};