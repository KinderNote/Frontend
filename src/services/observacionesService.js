//const API_URL = 'https://kindernote-backend.onrender.com/kindernote/api';
//const API_URL = 'http://localhost:8080/kindernote/api';

const etiquetasPrueba = [
    { id: 1, nombre: 'Lenguaje' },
    { id: 2, nombre: 'Socialización' },
    { id: 3, nombre: 'Motricidad' },
    { id: 4, nombre: 'Autonomía' },
    { id: 5, nombre: 'Expresión artística' },
    { id: 6, nombre: 'Pensamiento matemático' },
    { id: 7, nombre: 'Desarrollo emocional' },
    { id: 8, nombre: 'Juego' },
    { id: 9, nombre: 'Hábitos' }
];

export async function getEtiquetas() {
    await new Promise(resolve => setTimeout(resolve, 500));

    return etiquetasPrueba;
}

let observacionesPrueba = [
    {
        id: 1,
        alumnoId: 1,
        fecha: '2026-10-28',
        nota: 'Participó activamente en la actividad de lectura.',
        etiquetaId: 1,
        etiqueta: 'Lenguaje'
    },
    {
        id: 2,
        alumnoId: 1,
        fecha: '2026-10-26',
        nota: 'Compartió los materiales con sus compañeros.',
        etiquetaId: 2,
        etiqueta: 'Socialización'
    },
    {
        id: 3,
        alumnoId: 1,
        fecha: '2026-10-24',
        nota: 'Logró realizar la actividad de encastre sin ayuda.',
        etiquetaId: 3,
        etiqueta: 'Motricidad'
    }
];


export async function getObservacionesPorAlumno(alumnoId) {
    await new Promise(resolve => setTimeout(resolve, 300));

    return observacionesPrueba.filter(
        observacion => observacion.alumnoId === Number(alumnoId)
    );
}

// Guardar una observación nueva
export async function guardarObservacion(datos) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const nuevaObservacion = {
        id: Date.now(),
        ...datos
    };

    observacionesPrueba.push(nuevaObservacion);

    return nuevaObservacion;
}

// Modificar una observación existente
export async function editarObservacion(id, datos) {
    await new Promise(resolve => setTimeout(resolve, 300));

    observacionesPrueba = observacionesPrueba.map(observacion =>
        observacion.id === id
            ? { ...observacion, ...datos }
            : observacion
    );

    return observacionesPrueba.find(observacion => observacion.id === id);
}

// Eliminar una observación
export async function eliminarObservacion(id) {
    await new Promise(resolve => setTimeout(resolve, 300));

    observacionesPrueba = observacionesPrueba.filter(
        observacion => observacion.id !== id
    );

    return true;
}