import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  datosPersonales: {
    nombreCliente: { type: String, required: true },
    ci: { type: String, required: true },
  },
  datosContacto: {
    email: { type: String, required: true },
    telefono: { type: String, required: true },

  },
  datosAdicionales: {
    fechaApartado: { type: String, required: true },
    ocupacion: { type: String, required: true },
    vendedor: { type: String }
  },
  lotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lote' }]
})

export default mongoose.model('Cliente', clienteSchema)