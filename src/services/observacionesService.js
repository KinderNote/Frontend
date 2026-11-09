const API_URL = 'https://kindernote-backend.onrender.com/kindernote/api';
//const API_URL = 'http://localhost:8080/kindernote/api';

// Etiquetas predeterminadas: coinciden con el enum Etiqueta de Java.
const etiquetasPredeterminadas = [
    { valor: 'JUEGO', nombre: 'Juego' },
    { valor: 'MATEMATICA', nombre: 'Matemática' },
    { valor: 'PSICOMOTRIZ', nombre: 'Psicomotriz' },
    { valor: 'MOTRIZ', nombre: 'Motriz' },
    { valor: 'LENGUAJE', nombre: 'Lenguaje' },
    { valor: 'COMUNICACION', nombre: 'Comunicación' },
    { valor: 'EXPLORACION_AMBIENTE', nombre: 'Exploración del ambiente' },
    { valor: 'EXPRESION_ARTISTICA', nombre: 'Expresión artística' },
    { valor: 'PROYECTOS_TRABAJADOS', nombre: 'Proyectos trabajados' }
];

// Obtener etiquetas predeterminadas y personalizadas de una maestra.
export async function getEtiquetas(maestraId) {
    const respuesta = await fetch(
        `${API_URL}/etiqueta/maestraId/?maestraId=${maestraId}`
    );

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las etiquetas personalizadas.');
    }

    const personalizadas = await respuesta.json();

    const predeterminadas = etiquetasPredeterminadas.map(etiqueta => ({
        tipo: 'PREDETERMINADA',
        valor: etiqueta.valor,
        nombre: etiqueta.nombre,
        id: null,
        color: null,
        clave: `PREDETERMINADA:${etiqueta.valor}`
    }));

    const etiquetasMaestra = personalizadas.map(etiqueta => ({
        tipo: 'PERSONALIZADA',
        valor: null,
        nombre: etiqueta.nombre,
        id: etiqueta.id,
        color: etiqueta.color,
        clave: `PERSONALIZADA:${etiqueta.id}`
    }));

    return [...predeterminadas, ...etiquetasMaestra];
}

// Obtener observaciones de un alumno.
export async function getObservacionesPorAlumno(alumnoId) {
    const respuesta = await fetch(
        `${API_URL}/observacion/alumno/${alumnoId}`
    );

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las observaciones.');
    }

    const datos = await respuesta.json();

    return datos.map(obs => {
        const personalizada = obs.etiquetaPersonalizada;

        return {
            id: obs.id,
            alumnoId,
            nota: obs.descripcion,
            fecha: obs.fechaCreacion,

            etiquetaTipo: personalizada
                ? 'PERSONALIZADA'
                : 'PREDETERMINADA',

            etiquetaId: personalizada ? personalizada.id : null,
            etiquetaValor: personalizada ? null : obs.etiqueta,

            etiqueta: personalizada
                ? personalizada.nombre
                : obs.etiqueta,

            color: personalizada ? personalizada.color : null,

            etiquetaClave: personalizada
                ? `PERSONALIZADA:${personalizada.id}`
                : `PREDETERMINADA:${obs.etiqueta}`
        };
    });
}

// Preparar los datos para el DTO del backend.
function prepararDatosObservacion(datos) {
    return {
        descripcion: datos.nota,
        fechaCreacion: convertirFechaBackend(datos.fecha),

        etiqueta: datos.etiquetaTipo === 'PREDETERMINADA'
            ? datos.etiquetaValor
            : null,

        etiquetaPersonalizadaId: datos.etiquetaTipo === 'PERSONALIZADA'
            ? datos.etiquetaId
            : null
    };
}

// Crear observación.
export async function guardarObservacion(datos) {
    const respuesta = await fetch(`${API_URL}/observacion/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            alumnoId: datos.alumnoId,
            ...prepararDatosObservacion(datos)
        })
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo guardar la observación.');
    }

    return await respuesta.json();
}

// Editar observación.
export async function editarObservacion(id, datos) {
    const respuesta = await fetch(`${API_URL}/observacion/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prepararDatosObservacion(datos))
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo modificar la observación.');
    }

    return await respuesta.json();
}

// Eliminar observación.
export async function eliminarObservacion(id) {
    const respuesta = await fetch(`${API_URL}/observacion/${id}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo eliminar la observación.');
    }

    return true;
}

function convertirFechaBackend(fecha) {
    if (!fecha) return '';

    const [anio, mes, dia] = fecha.split('-');
    return `${dia}-${mes}-${anio}`;
}