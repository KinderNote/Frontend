import { PDFDownloadLink } from '@react-pdf/renderer';
import { InformePdfDocument } from './Informe';
import { textosToItems } from '../../services/informeService';

export const BotonExportarPdf = ({alumno, maestra, aulaNombre, informe }) => {
  
  const alumnoInfo = {
    nombre: alumno.nombre + " " + alumno.apellido,
    aula: aulaNombre,
    edad: alumno.edad,
    docente: maestra.nombre + " " + maestra.apellido,
    fechaInforme: informe.fechaCreacion
  };

  const listaAreas = textosToItems(informe.textoPorArea)

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
              padding: '0 18px',
              height: '48px',
              backgroundColor: '#A00B00',
              color: '#FFF',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Generando PDF...' : 'Exportar PDF'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};