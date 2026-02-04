import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "/mh.png"

export const generarPdfLote = async (cliente, lote, backendUrl) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const tableWidth = pageWidth - 20;
  const cellWidth = tableWidth / 4;
  let y = 15;

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return ""
    const [year, month, day] = fecha.split("T")[0].split("-")
    return `${day}/${month}/${year}`
  }

  // Formato de barras de sección
  const drawSectionBar = (doc, y, texto, colorRGB = [81, 128, 144], altura = 7) => {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Barra de fondo
    doc.setFillColor(...colorRGB);
    doc.rect(10, y, pageWidth - 20, altura, "F");

    // Texto centrado
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(texto, pageWidth / 2, y + altura / 2, { align: "center", baseline: "middle" });

    // Resetear color de texto
    doc.setTextColor(0, 0, 0);

    // Resetear nueva posición Y (debajo de la barra)
    return y + altura;
  }

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
      columnStyles: Object.fromEntries(
        head.map((_, index) => [index, { cellWidth: colWidthFixed }])
      ),
      head: [head],
      body,
    });

    return doc.lastAutoTable.finalY;
  }

  // Datos de la tabla de estado de cuenta
  const tables = [
    {
      head: ["Proyecto", "Cliente", "Correo", "Teléfono"],
      body: [[
        "Manta Hills",
        cliente.datosPersonales.nombrecliente,
        cliente.datosContacto.email,
        `+${cliente.datosContacto.telefono}`,
      ]]
    },
    {
      head: ["Etapa", "Manzana", "N° Lote", "Financiamiento"],
      body: [[
        lote.infoLote.etapa,
        lote.infoLote.manzana,
        lote.infoLote.lote,
        lote.infoLote.financiamiento,
      ]]
    },
    {
      head: ["Área m²", "Valor m²", "Valor Total", "Descuento"],
      body: [[
        lote.infoLote.area,
        lote.infoLote.valorm2,
        lote.infoLote.valortotal,
        lote.infoLote.valordscto,
      ]]
    },
    {
      head: ["Valor Entrada + Reserva", "Valor Cuota", "Cuotas Pagadas (Total o Parcialmente)", "Valor Cuotas Pagadas"],
      body: [[
        lote.infoLote.entradareserva,
        lote.infoLote.valorcuota,
        lote.estadoCuenta.cuotaspagadas,
        lote.estadoCuenta.valorcuotaspagadas,
      ]]
    },
    {
      head: ["Valor Vencido", "Total Recibido", "Saldo por Pagar", "Dividendos por Pagar"],
      body: [[
        lote.estadoCuenta.valorvencido,
        lote.estadoCuenta.valorpagado,
        lote.estadoCuenta.valorporpagar,
        lote.estadoCuenta.dividendosporpagar,
      ]],
    },
  ]

  // Datos de la tabla Información Bancaria
  const infoBancaria = {
    head: ["Banco", "N° Cuenta", "Tipo de Cuenta", "RUC"],
    body: [[
      "Banco Pichincha",
      "3515150604",
      "Corriente",
      "1792331277001",
    ]]
  }

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
  })

  const fechaInfo = import.meta.env.VITE_INFO_DATE || "";
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
  })

  y = doc.lastAutoTable.finalY + 5;

  // ====== FLUJO DE PAGOS (API) ====== 
  const loteBuscar = lote.infoLote.lote + lote.infoLote.manzana;
  try {
    const res = await fetch(`${backendUrl}/pagos/${loteBuscar}`);
    const data = await res.json();
    if (data?.[0]?.pagos?.length) {
      y = drawSectionBar(doc, y, "FLUJO DE CAJA");
      const filas = [];
      data[0].pagos.forEach(pago => {
        const detalles = pago.detalles
          .slice()
          .sort((a, b) => {
            const numA = parseInt(a.detalle.replace(/\D/g, ""), 10)
            const numB = parseInt(b.detalle.replace(/\D/g, ""), 10)
            return numB - numA
          })
          .map(det => `${det.detalle}`)
          .join("\n")
        filas.push([
          formatearFecha(pago.fechaPago),
          `$ ${pago.totalPorFecha}`,
          pago.formaPago,
          detalles,
        ]);
      });
      autoTable(doc, {
        startY: y,
        tableWidth,
        margin: { left: 10, right: 10 },
        theme: "grid",
        head: [["Fecha de Pago", "Valor Pagado", "Forma de Pago", "Detalle del Pago"]],
        body: filas,
        styles: {
          fontSize: 9,
          cellPadding: 1.2,
          overflow: "linebreak",
          textColor: 0,
          valign: "middle"
        },
        headStyles: {
          fillColor: [155, 198, 209],
          textColor: 0,
          valign: "middle"
        },
        columnStyles: {
          0: { cellWidth: cellWidth },
          1: { cellWidth: cellWidth },
          2: { cellWidth: cellWidth },
          3: { cellWidth: cellWidth },
        }
      });
    }
  } catch (err) { doc.text("No se pudo cargar el flujo de pagos", 14, y); }

  // Tabla Informacion Importante
  y = doc.lastAutoTable.finalY + 5;
  y = drawSectionBar(doc, y, "INFORMACIÓN IMPORTANTE");

  doc.setTextColor(0, 0, 0);

  const infoTexto = "Adjunto a la presente sírvase encontrar su estado de cuenta de todos los pagos realizados a Manta Hills por el terreno reservado por usted, de igual manera le agradecemos que revise todos los datos que se encuentran consignados en este documento."

  const textLines = doc.splitTextToSize(infoTexto, tableWidth - 4);
  const alturaCuadro = textLines.length * 4 + 2;

  // Dibujar el rectangulo
  doc.setDrawColor(200, 200, 200);
  doc.rect(10, y, tableWidth, alturaCuadro, "S");

  // Calcular offset para centrar el texto verticalmente
  const offsetY = y + (alturaCuadro - textLines.length * 4) / 2 + 2.5;

  // Escribir el texto dentro del rectangulo
  textLines.forEach((line, index) => {
    doc.text(line, 10 + 2, offsetY + index * 4, { align: "justify" });
  });

  // ====== GUARDAR PDF ====== 
  const nombreArchivo = `EC-${lote.infoLote.manzana}${lote.infoLote.lote}`
    .replace(/\s+/g, "_");

  doc.save(`${nombreArchivo}.pdf`);
};