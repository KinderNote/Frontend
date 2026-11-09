import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType 
} from "docx";
import { saveAs } from "file-saver";

export const descargarDocxInforme = async (alumno, areas) => {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }, // 1 pulgada (72pt * 20 dxa)
          },
        },
        children: [
          // 1. TÍTULO PRINCIPAL
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `INFORME DE ${alumno.nombre.toUpperCase()}`,
                bold: true,
                size: 32, // 16pt
                color: "1A365D",
                font: "Arial",
              }),
            ],
          }),

          // 2. TABLA DE ENCABEZADO / DATOS DEL ALUMNO
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER,
            rows: [
              crearFilaTabla("Nombre y apellido:", alumno.nombre),
              crearFilaTabla("Sala:", alumno.aula),
              crearFilaTabla("Edad:", alumno.edad.toString()),
              crearFilaTabla("Docente:", alumno.docente),
              crearFilaTabla("Fecha del informe:", alumno.fechaInforme),
            ],
          }),

          // ESPACIO DEPARADOR
          new Paragraph({ spacing: { after: 300 } }),

          // 3. SECCIONES DE CADA ÁREA DE DESARROLLO
          ...areas.flatMap((item) => [
            // Subtítulo del Área (con borde inferior decorativo)
            new Paragraph({
              spacing: { before: 240, after: 120 },
              border: {
                bottom: { color: "BEE3F8", space: 4, style: BorderStyle.SINGLE, size: 6 },
              },
              children: [
                new TextRun({
                  text: item.area,
                  bold: true,
                  size: 24, // 12pt
                  color: "2B6CB0",
                  font: "Arial",
                }),
              ],
            }),
            // Texto narrativo del Área
            new Paragraph({
              alignment: AlignmentType.JUSTIFY,
              spacing: { after: 280, line: 276 }, // Espaciado de línea 1.15
              children: [
                new TextRun({
                  text: item.texto,
                  size: 21, // 10.5pt
                  color: "2D3748",
                  font: "Arial",
                }),
              ],
            }),
          ]),
        ],
      },
    ],
  });

  // Generar y descargar el Blob del archivo DOCX
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Informe_${alumno.nombre.replace(/\s+/g, "_")}.docx`);
};

// Función auxiliar para construir cada fila del cuadro de encabezado
function crearFilaTabla(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: { fill: "F7FAFC" },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
          left: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
          right: { style: BorderStyle.NONE },
        },
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: true,
                size: 20, // 10pt
                color: "4A5568",
                font: "Arial",
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 65, type: WidthType.PERCENTAGE },
        shading: { fill: "F7FAFC" },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
        },
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: value || "",
                size: 20, // 10pt
                color: "1A202C",
                font: "Arial",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}