/*
const API_URL = 'http://localhost:8080/kindernote/api';

export async function getBorradores() {
    const respuesta = await fetch(`${API_URL}/informe`);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los borradores.');
    }

    return await respuesta.json();
}

export async function guardarBorrador(borrador) {
    const respuesta = await fetch(`${API_URL}/informe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(borrador)
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo guardar el borrador.');
    }

    return await respuesta.json();
}
*/