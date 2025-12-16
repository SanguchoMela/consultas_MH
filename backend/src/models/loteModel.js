import mongoose, { set } from "mongoose";

const roundTwo = (num) => Math.round(num * 100) / 100;

const loteSchema = new mongoose.Schema({
    infoLote: {
        etapa: { type: String, required: true },
        manzana: { type: String, required: true },
        lote: { type: Number, required: true },
        area: { type: String, required: true },
        valorM2: { type: Number, required: true, set: roundTwo },
        valorTotal: { type: Number, required: true, set: roundTwo },
    },
    estadoCuenta: {
        // cuotasPagadas: { type: Number, required: true },
        // cuotasVencidas: { type: Number, required: true },
        // cuotasPendientes: { type: Number, required: true },
        valorPagado: { type: Number, required: true, set: roundTwo },
        valorVigente: { type: Number, required: true, set: roundTwo },
        valorVencido: { type: Number, required: true, set: roundTwo },
        valorPorPagar: { type: Number, required: true, set: roundTwo },
    },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' }
},{
    timestamps: true,
    toJSON: { getters: true }, 
    toObject: { getters: true }
})

export default mongoose.model('Lote', loteSchema)