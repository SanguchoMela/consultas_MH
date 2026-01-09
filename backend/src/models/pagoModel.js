import mongoose from "mongoose";

const detalleSchema = new mongoose.Schema(
    {
        detalle: { type: String, required: true }
    },
    { _id: false }
)

const pagoSchema = new mongoose.Schema(
    {
        fechaPago: { type: Date, required: true },
        formaPago: { type: String, required: true },
        totalPorFecha: { type: Number, required: true },
        detalles: [detalleSchema]
    },
    { _id: false }
)

const pagosSchema = new mongoose.Schema(
    {
        lote: { type: String, required: true, index: true, trim: true },
        totalPagado: { type: Number, required: true },
        pagos: [pagoSchema]
    },
    {
        collection: "flujo_pagos",
        timestamps: false
    }
)

export default mongoose.model("Pagos", pagosSchema)