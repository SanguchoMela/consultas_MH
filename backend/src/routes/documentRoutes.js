import express from 'express';
import { createDocument, getDocuments } from '../controllers/documentController.js';
import { verifyToken } from '../middlewares/auth.js'
import { checkPermission } from '../middlewares/permissions.js'
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

router.post('/documents', verifyToken, checkPermission(PERMISSIONS.CREATE_DOCUMENT), createDocument)
router.get('/documents', verifyToken, checkPermission(PERMISSIONS.READ_DOCUMENT), getDocuments)

export default router;