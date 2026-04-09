import express from "express";
import { exportarTodosLosPdfs, exportarPdfPorLote } from "../controllers/exportarPdf.js";

const router = express.Router();

router.get("/exportar-pdfs", exportarTodosLosPdfs);
router.get("/generar-pdf/:clienteId/:loteId", exportarPdfPorLote)

export default router;