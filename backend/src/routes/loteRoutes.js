import express from 'express'
import { getLotes, getLoteById } from '../controllers/loteController.js'

const router = express.Router()

router.get('/lotes', getLotes)
router.get('/lotes/:id', getLoteById)

export default router