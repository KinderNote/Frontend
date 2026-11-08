import { descargarDocxInforme } from './Informe';

export const BotonExportarDocx = ({alumno, maestra, aulaNombre, informe }) => {
  const manejarDescargaDocx = () => {
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

    descargarDocxInforme(alumnoInfo, listaAreas);
  };

  return (
    <button 
      onClick={manejarDescargaDocx}
      style={{
        padding: '10px 20px',
        backgroundColor: '#2B6CB0',
        color: '#FFF',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      Descargar en DOCX (Word)
    </button>
  );
}