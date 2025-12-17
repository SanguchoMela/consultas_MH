import Lote from '../models/loteModel.js';
import Cliente from '../models/clienteModel.js';
import mongoose from 'mongoose';

export const buscarLote = async (req, res) => {
  try {
    // // Estado de la conexión a MongoDB
    // console.log('MongoDB Connection Status:', mongoose.connection.readyState);

    const { lote, manzana } = req.query;

    // // Debugging logs
    // console.log('Query parameters:', req.query);
    // console.log("Lote recibido:", lote);
    // console.log("Manzana recibida:", manzana);

    if (!lote || !manzana) {
      return res.status(400).json({ error: 'Debe proporcionar tanto el lote como la manzana' });
    }

    // Convert 'lote' to a number (since it's stored as a number in the DB)
    const loteNum = Number(lote);

    // // Debugging log
    // console.log("loteNum", loteNum)

    // Ensure loteNum is a valid number
    if (isNaN(loteNum)) {
      return res.status(400).json({ error: 'El lote debe ser un número válido.' });
    }

    // // Debugging log
    // console.log('MongoDB Query:', { "infoLote.lote": loteNum, "infoLote.manzana": manzana.toUpperCase() });

    // Buscar lotes por manzana y lote
    const lotes = await Lote.find({
      "infoLote.lote": loteNum,  // Query with lote as a number
      "infoLote.manzana": manzana.toUpperCase() // Normalizar la manzana a mayúsculas
    }).populate('cliente');
    
    // // Debugging log
    // console.log('Lotes encontrados:', lotes.length);

    if (lotes.length === 0) {
      return res.status(404).json({ error: 'No se encontró el lote buscado.' });
    }

    // Obtener los clientes asociados a los lotes
    const clientesDesdeLotes = lotes
      .map((lote) => lote.cliente)
      .filter((cliente) => cliente !== null);

    // Eliminar duplicados
    const clientesUnicos = Array.from(new Map(clientesDesdeLotes.map(cliente => [cliente._id.toString(), cliente])).values());

    // Poblar los lotes de los clientes únicos
    const clientesFinal = await Cliente.populate(clientesUnicos, { path: 'lotes' });

    return res.json(clientesFinal);
  } catch (error) {
    console.error("🔥 Error en la búsqueda del lote:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getLotes = async (req, res) => {
    try {
        const lotes = await Lote.find().populate('cliente')
        res.status(200).json(lotes)
    } catch (error) {
        console.error('Error al obtener lotes:', error.message)
        res.status(500).json({ message: 'Error al obtener lotes: ', error: error.message })
    }
}

// export const getLoteById = async (req, res) => {
//     try {
//         const { id } = req.params
//         const lote = await Lote.findById(id).populate('cliente')
//         if (!lote) {
//             return res.status(404).json({ message: 'Lote no encontrado' })
//         }
//         res.status(200).json(lote)
//     } catch (error) {
//         console.error('Error al obtener lote', error.message)
//         res.status(500).json({message: 'Error al obtener lote', error: error.message})
//     }
// }