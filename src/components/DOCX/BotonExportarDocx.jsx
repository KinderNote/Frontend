import { descargarDocxInforme } from './Informe';
import { textosToItems } from '../../services/informeService';

export const BotonExportarDocx = ({alumno, maestra, aulaNombre, informe }) => {
  const manejarDescargaDocx = () => {
    const alumnoInfo = {
      nombre: alumno.nombre + " " + alumno.apellido,
      aula: aulaNombre,
      edad: alumno.edad,
      docente: maestra.nombre + " " + maestra.apellido,
      fechaInforme: informe.fechaCreacion
    };

    const listaAreas = textosToItems(informe.textoPorArea)

    descargarDocxInforme(alumnoInfo, listaAreas);
  };

  return (
    <button 
      onClick={manejarDescargaDocx}
      style={{
        padding: '0 18px',
        height: '48px',
        backgroundColor: '#2B6CB0',
        color: '#FFF',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      Exportar DOCX
    </button>
  );
}