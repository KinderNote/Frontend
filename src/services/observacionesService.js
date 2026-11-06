const API_URL = 'http://localhost:8080/kindernote/api';

// Obtener etiquetas
export async function getEtiquetas() {
    const respuesta = await fetch(`${API_URL}/etiqueta`);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las etiquetas.');
    }

    return await respuesta.json();
}

// Obtener observaciones de un alumno
export async function getObservacionesPorAlumno(alumnoId) {
    const respuesta = await fetch(
        `${API_URL}/observacion/alumno/${alumnoId}`
    );

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las observaciones.');
    }

    const datos = await respuesta.json();

    return datos.map(obs => ({
        id: obs.id,
        alumnoId: obs.alumno?.id,
        nota: obs.descripcion,
        fecha: obs.fechaCreacion,
        etiquetaId: obs.etiqueta?.id,
        etiqueta: obs.etiqueta?.nombre
    }));
}

// Crear observación
export async function guardarObservacion(datos) {
    const respuesta = await fetch(`${API_URL}/observacion/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            alumnoId: datos.alumnoId,
            descripcion: datos.nota,
            fechaCreacion: datos.fecha,
            etiquetaId: datos.etiquetaId
        })
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo guardar la observación.');
    }

    const obs = await respuesta.json();

    return {
        id: obs.id,
        alumnoId: datos.alumnoId,
        nota: obs.descripcion,
        fecha: obs.fechaCreacion,
        etiquetaId: datos.etiquetaId,
        etiqueta: datos.etiqueta
    };
}

// Editar observación
export async function editarObservacion(id, datos) {
    const respuesta = await fetch(`${API_URL}/observacion/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            alumnoId: datos.alumnoId,
            descripcion: datos.nota,
            fechaCreacion: datos.fecha,
            etiquetaId: datos.etiquetaId
        })
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo modificar la observación.');
    }

    const obs = await respuesta.json();

    return {
        id: obs.id,
        alumnoId: datos.alumnoId,
        nota: obs.descripcion,
        fecha: obs.fechaCreacion,
        etiquetaId: datos.etiquetaId,
        etiqueta: datos.etiqueta
    };
}

// Eliminar observación
export async function eliminarObservacion(id) {
    const respuesta = await fetch(`${API_URL}/observacion/${id}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo eliminar la observación.');
    }

    return true;
}