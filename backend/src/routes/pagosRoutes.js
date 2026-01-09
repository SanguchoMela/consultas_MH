import express from 'express'
import { getPagos, getPagosByLote } from '../controllers/pagosController.js'

const router = express.Router()

router.get('/pagos', getPagos)
router.get('/pagos/:lote', getPagosByLote)

export default router