import mongoose from "mongoose";

const loteSchema = new mongoose.Schema({
    infoLote: {
        etapa: { type: String, required: true },
        manzana: { type: String, required: true },
        lote: { type: Number, required: true },
        area: { type: String, required: true },
        valorM2: { type: Number, required: true },
        valorTotal: { type: Number, required: true },
    },
    estadoCuenta: {
        // cuotasPagadas: { type: Number, required: true },
        // cuotasVencidas: { type: Number, required: true },
        // cuotasPendientes: { type: Number, required: true },
        valorPagado: { type: Number, required: true },
        valorVigente: { type: Number, required: true },
        valorVencido: { type: Number, required: true },
        valorPorPagar: { type: Number, required: true },
    },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' }
})

export default mongoose.model('Lote', loteSchema)