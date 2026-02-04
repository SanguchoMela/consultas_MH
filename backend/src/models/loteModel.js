import mongoose from "mongoose";

const loteSchema = new mongoose.Schema({
    infoLote: {
        financiamiento: { type: String, required: true },
        etapa: { type: String, required: true },
        manzana: { type: String, required: true },
        lote: { type: Number, required: true },
        area: { type: String, required: true },
        valorM2: { type: String, required: true },
        valorTotal: { type: String, required: true },
        dscto: { type: Number, required: true },
        valorDscto: { type: String, required: true },
        entrada: { type: String, required: true },
        reserva: { type: String, required: true },
        entradaReserva: { type: String, required: true },
        valorCuota: { type: String, required: true },
    },
    estadoCuenta: {
        valorPagado: { type: String, required: true },
        valorVigente: { type: String, required: true },
        valorVencido: { type: String, required: true },
        valorPorPagar: { type: String, required: true },
        valorCuotasPagadas: { type: String, required: true },
        cuotasPagadas: { type: String, required: true },
        dividendosPorPagar: { type: String, required: true },
    },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
})

export default mongoose.model('Lote', loteSchema)