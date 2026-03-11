import express from "express";
import {exportarTodosLosPdfs} from "../controllers/exportarPdf.js";

const router = express.Router();

router.get("/exportar-pdfs", exportarTodosLosPdfs);

export default router;