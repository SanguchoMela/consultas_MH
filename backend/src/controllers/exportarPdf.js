import archiver from "archiver";
import Cliente from "../models/clienteModel.js";
import Lote from "../models/loteModel.js";
import Pagos from "../models/pagoModel.js";
import { generarPdfBuffer } from "../utils/generarPdfBuffer.js";
import { agregarDatosMora } from "../utils/agregarDatosMora.js";
import { obtenerUltimoPagoCuota } from "../utils/mora.js";

export const exportarPdfPorLote = async (req, res) => {
  try {
    const { clienteId, loteId } = req.params;

    let cliente = await Cliente.findById(clienteId).populate("lotes").lean();

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const pagosDocs = await Pagos.find().lean();

    cliente = agregarDatosMora(cliente, pagosDocs);

    const lote = cliente.lotes.find((l) => l._id.toString() === loteId);

    if (!lote) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }

    const loteKey =
      String(lote.infoLote.lote).trim() + String(lote.infoLote.manzana).trim();

    const pagos = pagosDocs.find((p) => p.lote === loteKey)?.pagos || [];

    const pdfBuffer = await generarPdfBuffer(cliente, lote, pagos);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=EC_${loteKey}.pdf`,
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error("ERROR GENERANDO PDF:", error);
    res.status(500).json({ error: "Error generando PDF" });
  }
};

export const exportarTodosLosPdfs = async (req, res) => {
  try {
    // Obtener clientes con lotes
    const clientes = await Cliente.find().populate("lotes").lean();

    // Obtener todos los pagos
    const pagosDocs = await Pagos.find().lean();
    // Crear mapa de pagos por lote
    const pagosMap = new Map();

    pagosDocs.forEach((doc) => {
      pagosMap.set(doc.lote, doc.pagos || []);
    });

    // Preparar ZIP
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=estados-cuenta.zip",
    );

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(res);

    for (const cliente of clientes) {
      for (const lote of cliente.lotes) {
        const loteKey = lote.infoLote.lote + lote.infoLote.manzana;
        const pagos = pagosMap.get(loteKey) || [];

        try {
          const pdfBuffer = await generarPdfBuffer(cliente, lote, pagos);
          const nombrePdf = `EC_${loteKey}.pdf`;
          archive.append(pdfBuffer, { name: nombrePdf });
        } catch (error) {
          console.error("Error generando PDF del lote: ", error);
        }
      }
    }
    await archive.finalize();
  } catch (error) {
    console.error("Error al generar ZIP: ", error);
    res.status(500).json({ message: "Error al generar ZIP" });
  }
};
