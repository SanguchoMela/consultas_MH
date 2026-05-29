import express from 'express'
import { buscarLote, getLotes } from '../controllers/loteController.js'
import { verifyToken } from '../middlewares/auth.js'
import { checkPermission } from '../middlewares/permissions.js'
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router()

router.get('/buscar-lote', verifyToken, checkPermission(PERMISSIONS.VIEW_CLIENTS), buscarLote)
router.get('/lotes', verifyToken, checkPermission(PERMISSIONS.VIEW_CLIENTS), getLotes)

export default router