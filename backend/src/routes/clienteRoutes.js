import express from 'express'
import { buscarClientePorNombre, buscarClientePorCedula, getClientes } from '../controllers/clienteController.js'
import { checkPermission } from '../middlewares/permissions.js'
import { PERMISSIONS } from '../constants/permissions.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/buscar-nombre', verifyToken, checkPermission(PERMISSIONS.VIEW_REPORT), buscarClientePorNombre)
router.get('/buscar-cedula', verifyToken, checkPermission(PERMISSIONS.VIEW_REPORT), buscarClientePorCedula)
router.get('/clientes', verifyToken, checkPermission(PERMISSIONS.VIEW_REPORT), getClientes)

export default router