// Endpoints del backend (EtiquetaPersonalizadaController):
//   GET    /etiqueta/maestraId/?maestraId=  -> [{ id, nombre }]
//   POST   /etiqueta/crear  { nombre, maestraId }
//   PUT    /etiqueta/{id}   { nombre }
//   DELETE /etiqueta/{id}
const API_URL = 'https://kindernote-backend.onrender.com/kindernote/api/etiqueta';
//const API_URL = 'http://localhost:8080/kindernote/api/etiqueta';

export async function getEtiquetasPorMaestra(maestraId) {
    const respuesta = await fetch(`${API_URL}/maestraId/?maestraId=${maestraId}`);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las etiquetas.');
    }

    return await respuesta.json();
}

export async function crearEtiqueta(nombre, maestraId) {
    const respuesta = await fetch(`${API_URL}/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, maestraId })
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo crear la etiqueta. Verificá que el nombre no esté repetido.');
    }

    return await respuesta.text();
}

export async function editarEtiqueta(id, nombre) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre })
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo editar la etiqueta. Verificá que el nombre no esté repetido.');
    }

    return await respuesta.text();
}

export async function eliminarEtiqueta(id) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo eliminar la etiqueta.');
    }

    return await respuesta.text();
}
