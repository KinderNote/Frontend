import { PDFDownloadLink } from '@react-pdf/renderer';
import { InformePdfDocument } from './Informe';

export const BotonExportarPdf = ({alumno, maestra, aulaNombre, informe }) => {
  
  const alumnoInfo = {
    nombre: alumno.nombre + " " + alumno.apellido,
    aula: aulaNombre,
    edad: alumno.edad,
    docente: maestra.nombre + " " + maestra.apellido,
    fechaInforme: informe.fechaCreacion
  };

  const listaAreas = []

  Object.keys(informe.textoPorArea).forEach((area) => {
    listaAreas.push(
      {
        "area": area,
        "texto": informe.textoPorArea[area]
      }
    )
  })

  return (
    <div>
      <PDFDownloadLink
        document={<InformePdfDocument alumno={alumnoInfo} areas={listaAreas} />}
        fileName={`Informe_${alumnoInfo.nombre.replace(/\s+/g, '_')}.pdf`}
      >
        {({ loading }) => (
          <button 
            disabled={loading}
            style={{
              width: 'max-content',
              height: '48px',
              borderRadius: '12px',
              padding: '0 18px',
              margin: '0 auto',
              font: '500 15px \'Lexend-Regular\',sans-serif',
              flex: '1',
              background: '#C98A12',
              color: '#1F2A2E'
            }}
          >
            {loading ? 'Generando PDF...' : 'Exportar PDF'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};