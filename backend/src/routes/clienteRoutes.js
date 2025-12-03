import express from 'express'
import { getClientes, getClienteById } from '../controllers/clienteController.js'

const router = express.Router()

router.get('/clientes', getClientes)
router.get('/clientes/:id', getClienteById)

export default router