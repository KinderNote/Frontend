import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InformePdfDocument } from './Informe';

export const BotonDescargarInforme = () => {
//export const DescargarInformeButton = ({ datosBackend }) => {
  // Supongamos que datosBackend contiene la respuesta combinada de tu sistema
  /*const alumnoInfo = {
    nombre: datosBackend.nombreAlumno,
    sala: datosBackend.sala,
    edad: datosBackend.edad,
    docente: datosBackend.docente,
    fechaInforme: new Date().toLocaleDateString('es-AR')
  };

  // La lista de áreas devuelta por el backend [{"area": "...", "texto": "..."}, ...]
  const listaAreas = datosBackend.informePorAreas;*/

  const alumnoInfo = {
    nombre: "Pepe",
    sala: "Roja",
    edad: 4,
    docente: "Mengana",
    fechaInforme: new Date().toLocaleDateString('es-AR')
  };

  // La lista de áreas devuelta por el backend [{"area": "...", "texto": "..."}, ...]
  const listaAreas = [
    {
      "area": "Matemática",
      "texto": "Matías demuestra un destacado avance en el área de pensamiento matemático. Es capaz de recitar la serie numérica de manera ordenada superando el 30 con mucha seguridad. Asimismo, reconoce con claridad cómo se conforman los números escritos, lo que evidencia una gran curiosidad y comprensión de las nociones numéricas para su etapa."
    },
    {
      "area": "Juego",
      "texto": "En sus momentos de juego, Matías interactúa de manera armónica y entusiasta con sus pares. Destaca su habilidad para planificar las propuestas lúdicas, establecer y acordar roles, y anticipar acciones durante la actividad, lo que enriquece significativamente las experiencias de juego compartido y favorece su desarrollo socioemocional."
    },
    {
      "area": "Lenguaje",
      "texto": "En el área del lenguaje y la comunicación, Matías se expresa de forma muy fluida y precisa. Construye frases completas bien estructuradas y utiliza un vocabulario amplio y variado, lo que le permite manifestar con claridad sus ideas, intereses, necesidades y sentimientos dentro del grupo."
    }
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      <PDFDownloadLink
        document={<InformePdfDocument alumno={alumnoInfo} areas={listaAreas} />}
        fileName={`Informe_${alumnoInfo.nombre.replace(/\s+/g, '_')}.pdf`}
      >
        {({ loading }) => (
          <button 
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#CBD5E0' : '#3182CE',
              color: '#FFF',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Generando PDF...' : 'Descargar Informe en PDF'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};