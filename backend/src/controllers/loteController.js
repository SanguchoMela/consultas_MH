import Lote from '../models/loteModel.js'

export const getLotes = async (req, res) => {
    try {
        const lotes = await Lote.find().populate('cliente')
        res.status(200).json(lotes)
    } catch (error) {
        console.error('Error al obtener lotes:', error.message)
        res.status(500).json({ message: 'Error al obtener lotes: ', error: error.message })
    }
}

export const getLoteById = async (req, res) => {
    try {
        const { id } = res.params
        const lote = await Lote.findById(res.params.id).populate('cliente')
        if (!lote) {
            return res.status(404).json({ message: 'Lote no encontrado' })
        }
        res.status(200).json(lote)
    } catch (error) {
        console.error('Error al obtener lote', error.message)
        res.status(500).json({message: 'Error al obtener lote', error: error.message})
    }
}