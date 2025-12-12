import express from 'express'
import { buscarLote, getLotes } from '../controllers/loteController.js'

const router = express.Router()

router.get('/buscar-lote', buscarLote)
router.get('/lotes', getLotes)
// router.get('/lotes/:id', getLoteById)

export default router