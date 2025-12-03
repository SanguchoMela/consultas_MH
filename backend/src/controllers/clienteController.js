import Cliente from '../models/clienteModel.js'

export const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find().populate('lotes')
        res.status(200).json(clientes)
    } catch (error) {
        console.error('Error al obtener clientes:', error.message)
        res.status(500).json({ message: 'Error del servidor al obtener a los clientes' })
    }
}

export const getClienteById = async (req, res) => {
    try {
        const { id } = req.params
        const cliente = await Cliente.findById(id).populate('lotes')

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }

        res.status(200).json(cliente)
    } catch (error) {
        console.error('Error al obtener cliente', error.message)
        res.status(500).json({ message: 'Error del servidor al obtener el cliente' })
    }
}