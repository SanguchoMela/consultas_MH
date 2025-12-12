import express from 'express'
import { buscarClientePorNombre, buscarClientePorCedula, getClientes } from '../controllers/clienteController.js'

const router = express.Router()

router.get('/buscar-nombre', buscarClientePorNombre)
router.get('/buscar-cedula', buscarClientePorCedula)
router.get('/clientes', getClientes)
// router.get('/clientes/:id', getClienteById)

export default router