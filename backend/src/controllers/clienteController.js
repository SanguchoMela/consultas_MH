import Cliente from "../models/clienteModel.js";

export const buscarClientePorNombre = async (req, res) => {
  try {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({ error: 'Debe proporcionar un nombre para la búsqueda.' });
    }

    // Separar palabras de búsqueda
    const palabras = nombre.trim().split(/\s+/)

    // Crear filtro AND para cada palabra
    const filtro = palabras.map(palabra => ({
      "datosPersonales.nombrecliente": {
        $regex: palabra,
        $options: 'i'
      }
    }))

    // Buscar clientes que coincidan con todas las palabras
    const clientes = await Cliente.find({ $and: filtro }).populate('lotes')

    if (clientes.length === 0) {
      return res.status(404).json({ error: 'No se encontraron clientes.' })
    }

    return res.json(clientes);
  } catch (error) {
    console.error("🔥 Error en la búsqueda por nombre:", error);
    return res.status(500).json({ error: error.message });
  }
}

export const buscarClientePorCedula = async (req, res) => {
  try {
    const { cedula } = req.query;
    if (!cedula) {
      return res.status(400).json({ error: 'Debe proporcionar una cédula para la búsqueda.' });
    }
    const cliente = await Cliente.findOne({ "datosPersonales.ci": cedula }).populate('lotes');

    return res.json(cliente ? [cliente] : []);
  } catch (error) {
    console.error("🔥 Error en la búsqueda por cédula:", error)
    return res.status(500).json({ error: error.message });
  }
}

export const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().populate('lotes')
    res.status(200).json(clientes)
  } catch (error) {
    console.error('Error al obtener clientes:', error.message)
    res.status(500).json({ message: 'Error al obtener clientes: ', error: error.message })
  }
}
