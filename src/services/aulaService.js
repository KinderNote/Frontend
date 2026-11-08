const API_URL = 'https://kindernote-backend.onrender.com/kindernote/api/aula';
//const API_URL = 'http://localhost:8080/kindernote/api/aula';

export async function getAulasPorMaestra(maestraId) {
    const respuesta = await fetch(`${API_URL}/maestraId/?maestraId=${maestraId}`);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las aulas.');
    }

    return await respuesta.json();
}

export async function crearAula(nombre, maestraId) {
    const respuesta = await fetch(`${API_URL}/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, maestraId })
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo crear el aula. Verificá que el nombre no esté repetido.');
    }

    return await respuesta.text();
}

export async function editarAula(id, nombre) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre })
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo editar el aula. Verificá que el nombre no esté repetido.');
    }

    return await respuesta.text();
}

export async function eliminarAula(id) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo eliminar el aula.');
    }

    return await respuesta.text();
}
