import Pagos from "../models/pagoModel.js"

export const getPagos = async (req, res) => {
    try {
        const pagos = await Pagos.find()
        res.status(200).json(pagos)
    } catch (error) {
        console.error("Error al obtener pagos", error.message)
        res.status(500).json({ message: "Error al obtener pagos: ", error: error.message })
    }
}

export const getPagosByLote = async (req, res) => {
    try {
        const { lote } = req.params

        const pagos = await Pagos.find({ lote: lote }).lean()

        if (!pagos || pagos.length === 0) {
            return res.status(404).json({ message: "Lote no encontrado o no tiene pagos registrados" })
        }

        res.status(200).json(pagos)
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pagos del lote: ", error: error.message })
    }
}