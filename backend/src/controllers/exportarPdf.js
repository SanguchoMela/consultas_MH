import archiver from "archiver";
import Cliente from "../models/clienteModel.js";
import Pagos from "../models/pagoModel.js"
import { generarPdfBuffer } from "../utils/generarPdfBuffer.js";

export const exportarTodosLosPdfs = async (req, res) => {
    try {
        // Obtener clientes con lotes
        const clientes = await Cliente.find().populate("lotes").lean()

        // Obtener todos los pagos
        const pagosDocs = await Pagos.find().lean()
        // Crear mapa de pagos por lote
        const pagosMap = new Map()

        pagosDocs.forEach(doc => {
            pagosMap.set(doc.lote, doc.pagos || [])
        })

        // Preparar ZIP
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", "attachment; filename=estados-cuenta.zip");

        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.on("error", (err) => {
            throw err;
        })

        archive.pipe(res);

        for (const cliente of clientes) {
            for (const lote of cliente.lotes) {
                const loteKey = lote.infoLote.lote + lote.infoLote.manzana
                const pagos = pagosMap.get(loteKey) || []

                try {
                    const pdfBuffer = await generarPdfBuffer(cliente, lote, pagos)
                    const nombrePdf = `EC_${loteKey}.pdf`
                    archive.append(pdfBuffer, { name: nombrePdf })
                } catch (error) {
                    console.error("Error generando PDF del lote: ", error)
                }
            }
        }
        await archive.finalize()
    } catch (error) {
        console.error("Error al generar ZIP: ", error)
        res.status(500).json({ message: "Error al generar ZIP" })
    }
}