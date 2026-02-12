import express from 'express'
import { getPagos, getPagosByLote } from '../controllers/pagosController.js'
import { checkPermission } from '../middlewares/permissions.js'
import { PERMISSIONS } from '../constants/permissions.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/pagos', verifyToken, checkPermission(PERMISSIONS.VIEW_PAGOS), getPagos)
router.get('/pagos/:lote', verifyToken, checkPermission(PERMISSIONS.VIEW_PAGOS), getPagosByLote)

export default router