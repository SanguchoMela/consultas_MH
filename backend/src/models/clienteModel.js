import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  datosPersonales: {
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    ci: { type: String, required: true, unique: true },
  },
  datosContacto: {
    email: { type: String, required: true },
    telefono: { type: String, required: true },

  },
  datosAdicionales: {
    ocupacion: { type: String, required: true },
    vendedor: { type: String }
  },
  lotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lote' }]
})

export default mongoose.model('Cliente', clienteSchema)