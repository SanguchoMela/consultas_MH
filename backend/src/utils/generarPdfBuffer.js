import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { logoBase64 } from "../assets/mh.js";

export const generarPdfBuffer = async (
  cliente,
  lote,
  pagos = [],
  ultimoValorPagado = 0,
) => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const tableWidth = pageWidth - 20;
  const cellWidth = tableWidth / 4;
  const amortizacionCellWidth = (tableWidth - 13) / 6;

  let y = 15;

  // Logo
  const logo = logoBase64;

  // Formateo de fecha
  const formatearFecha = (fecha) => {
    if (!(fecha instanceof Date)) return "";
    const day = String(fecha.getUTCDate()).padStart(2, "0");
    const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    const year = String(fecha.getUTCFullYear());

    return `${day}/${month}/${year}`;
  };

  // Formato de barras de sección
  const drawSectionBar = (
    doc,
    y,
    texto,
    colorRGB = [81, 128, 144],
    altura = 7,
  ) => {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Barra de fondo
    doc.setFillColor(...colorRGB);
    doc.rect(10, y, pageWidth - 20, altura, "F");

    // Texto centrado
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(texto, pageWidth / 2, y + altura / 2, {
      align: "center",
      baseline: "middle",
    });

    // Resetear color de texto
    doc.setTextColor(0, 0, 0);

    // Resetear nueva posición Y (debajo de la barra)
    return y + altura;
  };

  const drawSubBar = (doc, y, texto, color = [120, 150, 160], altura = 7) => {
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(...color);
    doc.rect(10, y, pageWidth - 20, altura, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(255);

    doc.text(texto, pageWidth / 2, y + altura / 2, {
      align: "center",
      baseline: "middle",
    });

    doc.setTextColor(0, 0, 0);

    return y + altura;
  };

  // Formato de tablas
  const drawTable = (doc, startY, head, body) => {
    const colWidthFixed = tableWidth / head.length;

    autoTable(doc, {
      startY,
      tableWidth,
      margin: { left: 10, right: 10 },
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 1.2,
        overflow: "linebreak",
        textColor: 0,
      },
      horizontalPageBreak: false,
      headStyles: {
        fillColor: [155, 198, 209],
        textColor: 0,
      },
      didParseCell: (data) => {
        const esTablaValorVencido = head[0] === "Valor Vencido";
        const valorVencido = Number(body[0][0]) || 0;

        if (esTablaValorVencido && valorVencido > 0) {
          if (data.section === "head" && data.column.index === 0) {
            data.cell.styles.fillColor = [220, 53, 69];
            data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = "bold";
          }

          if (data.section === "body" && data.column.index === 0) {
            data.cell.styles.fillColor = [255, 220, 220];
            data.cell.styles.textColor = [180, 0, 0];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
      columnStyles: Object.fromEntries(
        head.map((_, index) => [index, { cellWidth: colWidthFixed }]),
      ),
      head: [head],
      body,
    });

    return doc.lastAutoTable.finalY;
  };

  // Datos de la tabla de estado de cuenta
  const tables = [
    {
      head: ["Proyecto", "Cliente", "Correo", "Teléfono"],
      body: [
        [
          "Manta Hills",
          cliente.datosPersonales.nombrecliente,
          cliente.datosContacto.email,
          cliente.datosContacto.telefono,
        ],
      ],
    },
    {
      head: ["Etapa", "Manzana", "N° Lote", "Financiamiento"],
      body: [
        [
          lote.infoLote.etapa,
          lote.infoLote.manzana,
          lote.infoLote.lote,
          lote.infoLote.financiamiento,
        ],
      ],
    },
    {
      head: ["Área m²", "Valor m²", "Valor Total", "Descuento"],
      body: [
        [
          lote.infoLote.area,
          lote.infoLote.valorm2,
          lote.infoLote.valortotal,
          lote.infoLote.valordscto,
        ],
      ],
    },
    {
      head: [
        "Valor Entrada + Reserva",
        "Valor Cuota",
        "Cuotas Pagadas por completo",
        "Valor Cuotas Pagadas",
      ],
      body: [
        [
          lote.infoLote.entradareserva,
          lote.infoLote.valorcuota,
          Number(lote.estadoCuenta.valorporpagar) === 0
            ? lote.estadoCuenta.cuotaspagadas
            : lote.estadoCuenta.cuotasPagadasCompletas,
          lote.estadoCuenta.valorcuotaspagadas,
        ],
      ],
    },
    {
      head: [
        "Valor Vencido",
        "Total Recibido",
        "Saldo por Pagar",
        "Dividendos por Pagar",
      ],
      body: [
        [
          lote.estadoCuenta.valorvencido,
          lote.estadoCuenta.valorpagado,
          lote.estadoCuenta.valorporpagar,
          Number(lote.estadoCuenta.valorporpagar) === 0
            ? 0
            : lote.estadoCuenta.cuotasPorPagar,
        ],
      ],
    },
  ];

  // Datos de la tabla Información Bancaria
  const infoBancaria = {
    head: ["Banco", "N° Cuenta", "Tipo de Cuenta", "RUC"],
    body: [["Banco Pichincha", "3515150604", "Corriente", "1792331277001"]],
  };

  // =============================================================================
  // Logo y título
  doc.addImage(logo, "PNG", 12, 10, 32, 14);

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(51, 79, 91);
  doc.text("MANTA HILLS", pageWidth / 2, 22, { align: "center" });

  y = 28;

  // ==== Tabla Estado de Cuenta ====
  // Barra Estado de Cuenta
  y = drawSectionBar(doc, y, "ESTADO DE CUENTA");
  const tableStartY = y;
  y = tableStartY;

  tables.forEach((table) => {
    y = drawTable(doc, y, table.head, table.body);
  });

  const fechaInfo = process.env.INFO_DATE || "";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Fecha de corte: " + fechaInfo, 14, y + 4);

  y = doc.lastAutoTable.finalY + 9;

  // Tabla Información Bancaria
  // ==== Barra Información Bancaria ====
  y = drawSectionBar(doc, y, "INFORMACIÓN BANCARIA");

  y = drawTable(doc, y, infoBancaria.head, infoBancaria.body);

  y = doc.lastAutoTable.finalY;

  autoTable(doc, {
    startY: y,
    tableWidth,
    margin: { left: 10, right: 10 },
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 1.2,
      overflow: "linebreak",
      textColor: 0,
    },
    horizontalPageBreak: false,
    headStyles: {
      fillColor: [155, 198, 209],
      textColor: 0,
    },
    head: [["Nombre de la Cuenta"]],
    body: [["Constructora Vasconez Paredes"]],
  });

  y = doc.lastAutoTable.finalY + 5;

  // ====== FLUJO DE PAGOS ======
  if (pagos?.length) {
    y = drawSectionBar(doc, y, "FLUJO DE CAJA");
    const filas = [];
    pagos.forEach((pago) => {
      const detalles = (pago.detalles || [])
        .slice()
        .sort((a, b) => {
          const numA = parseInt((a.detalle || "").replace(/\D/g, ""), 10);
          const numB = parseInt((b.detalle || "").replace(/\D/g, ""), 10);
          return numB - numA;
        })
        .map((det) => {
          const valor = Number(det.valorPagado);
          return Number.isFinite(valor)
            ? `${det.detalle}: $ ${valor.toFixed(2)}`
            : `${det.detalle}`;
        })
        .join("\n");
      filas.push([
        formatearFecha(pago.fechaPago),
        `$ ${Number(pago.totalPorComprobante).toFixed(2)}`,
        pago.formaPago,
        detalles,
      ]);
    });
    autoTable(doc, {
      startY: y,
      tableWidth,
      margin: { left: 10, right: 10 },
      theme: "grid",
      head: [
        ["Fecha de Pago", "Valor Pagado", "Forma de Pago", "Detalle del Pago"],
      ],
      body: filas,
      styles: {
        fontSize: 9,
        cellPadding: 1.2,
        overflow: "linebreak",
        textColor: 0,
        valign: "middle",
      },
      headStyles: {
        fillColor: [155, 198, 209],
        textColor: 0,
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: cellWidth },
        1: { cellWidth: cellWidth },
        2: { cellWidth: cellWidth },
        3: { cellWidth: cellWidth },
      },
    });
  }

  // Tabla de Amortización
  y = doc.lastAutoTable.finalY + 5;

  if (lote.estadoCuenta.valorporpagar > 0 && lote.tablaAmortizacion?.length) {
    const pageHeight = doc.internal.pageSize.getHeight()
    const espacioNecesario = 40
    if (y + espacioNecesario > pageHeight - 10) {
      doc.addPage()
      y = 15
    }
    // Encabezado principal
    y = drawSectionBar(doc, y, "TABLA DE AMORTIZACIÓN");

    const inicioCuota = Number(lote.estadoCuenta.ultimaCuotaPagada) || 0;

    const cuotas = lote.tablaAmortizacion.map((item, index) => ({
      numero: inicioCuota + index + 1,
      ...item,
    }));

    const cuotasVencidas = cuotas.filter((c) => Number(c.diasMora) > 0);

    const cuotasPorVencer = cuotas.filter((c) => Number(c.diasMora) === 0);

    const generarTabla = (titulo, datos, esVencidas = false) => {
      if (!datos.length) return;

      const colorTitulo = esVencidas ? [245, 158, 11] : [120, 150, 160];

      const pageHeight = doc.internal.pageSize.getHeight()
      const espacioNecesario = 40
      if (y + espacioNecesario > pageHeight - 10) {
        doc.addPage()
        y = 15
      }

      y = drawSubBar(doc, y, titulo, colorTitulo, 7);

      const body = datos.map((item) => [
        item.numero,
        item.fecha,
        item.diasMora,
        `$ ${Number(item.valorCuotaAjustado).toFixed(2)}`,
        `$ ${Number(item.interes).toFixed(2)}`,
        `$ ${Number(item.totalPagar).toFixed(2)}`,
        `$ ${Number(item.saldo).toFixed(2)}`,
      ]);

      if (esVencidas) {
        body.push([
          {
            content: "TOTALES",
            colSpan: 3,
            styles: { halign: "center", fontStyle: "bold" },
          },
          {
            content: `$ ${Number(lote.estadoCuenta.totalValorCuotas || 0).toFixed(2)}`,
            styles: { fontStyle: "bold" },
          },
          {
            content: `$ ${Number(lote.estadoCuenta.totalInteres || 0).toFixed(2)}`,
            styles: { fontStyle: "bold" },
          },
          {
            content: `$ ${Number(lote.estadoCuenta.totalPagar || 0).toFixed(2)}`,
            styles: { fontStyle: "bold" },
          },
          { content: "" },
        ]);
      }

      autoTable(doc, {
        startY: y,
        margin: { left: 10, right: 10 },
        theme: "grid",

        head: [
          [
            "Cuota",
            "Fecha",
            "Días Mora",
            "Valor Cuota",
            "Interés",
            "Total a pagar",
            "Saldo",
          ],
        ],
        body,
        styles: {
          fontSize: 9,
          cellPadding: 1,
          overflow: "linebreak",
          textColor: 0,
        },

        headStyles: {
          fillColor: esVencidas ? [251, 191, 36] : [155, 198, 209],
          textColor: 0,
        },

        didParseCell: (data) => {
          if (!esVencidas || data.section !== "body") return;

          // Resaltar la última fila (TOTAL INTERÉS)
          if (data.row.index === body.length - 1) {
            data.cell.styles.fillColor = [230, 230, 230];
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.textColor = [0, 0, 0];
          } else {
            data.cell.styles.fillColor = [255, 251, 235];
            data.cell.styles.textColor = [180, 0, 0];
          }
        },

        columnStyles: {
          0: { cellWidth: 13 },
          1: { cellWidth: amortizacionCellWidth },
          2: { cellWidth: amortizacionCellWidth },
          3: { cellWidth: amortizacionCellWidth },
          4: { cellWidth: amortizacionCellWidth },
          5: { cellWidth: amortizacionCellWidth },
          6: { cellWidth: amortizacionCellWidth },
        },
      });

      y = doc.lastAutoTable.finalY;
    };

    generarTabla("CUOTAS VENCIDAS", cuotasVencidas, true);
    generarTabla("CUOTAS POR VENCER", cuotasPorVencer, false);
  }

  // =======================
  // INFORMACIÓN IMPORTANTE
  // =======================

  y = doc.lastAutoTable.finalY + 5;

  const pageHeight = doc.internal.pageSize.getHeight();

  const infoTexto = `Adjunto a la presente sírvase encontrar su estado de cuenta de todos los pagos realizados a Manta Hills por el terreno reservado por usted hasta el ${fechaInfo}, de igual manera le agradecemos que revise todos los datos que se encuentran consignados en este documento. De no estar de acuerdo con el mismo sírvase comunicarse a los números telefónicos 0983516817, 0987324065, 0992542227 o al correo contabilidad.mantahills@gmail.com`;

  const textoUAFE =
    "Todos estos ingresos han sido revisados y verificados tanto por la Sociedad Civil Comercial MANTA HILLS como por el Oficial de Cumplimiento de la UAFE.";

  // Calcular alturas
  const textLines = doc.splitTextToSize(infoTexto, tableWidth - 4);
  const alturaCuadro = doc.getTextDimensions(textLines).h + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  const linesUAFE = doc.splitTextToSize(textoUAFE, tableWidth - 4);
  const alturaUAFE = doc.getTextDimensions(linesUAFE).h + 4;

  // Espacio total del bloque
  const alturaBarra = 7;

  const espacioNecesario =
    alturaBarra +
    alturaCuadro +
    alturaUAFE;

  // Si no cabe TODO el bloque, crear nueva página
  if (y + espacioNecesario > pageHeight - 10) {
    doc.addPage();
    y = 15;
  }

  // Barra
  y = drawSectionBar(doc, y, "INFORMACIÓN IMPORTANTE");

  // ---------- Primer cuadro ----------
  doc.setDrawColor(200, 200, 200);
  doc.rect(10, y, tableWidth, alturaCuadro);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const offsetY = y + (alturaCuadro - textLines.length * 4) / 2 + 3;

  textLines.forEach((line, index) => {
    doc.text(line, 12, offsetY + index * 4);
  });

  y += alturaCuadro;

  // ---------- Segundo cuadro ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.setFillColor(245, 249, 252);
  doc.setDrawColor(200, 200, 200);
  doc.rect(10, y, tableWidth, alturaUAFE, "FD");

  const offsetYUAFE = y + (alturaUAFE - linesUAFE.length * 4) / 2 + 3;

  linesUAFE.forEach((line, index) => {
    doc.text(line, 12, offsetYUAFE + index * 4);
  });

  y += alturaUAFE;

  // =============================
  // DEVOLVER BUFFER
  // =============================
  return Buffer.from(doc.output("arraybuffer"));
};
