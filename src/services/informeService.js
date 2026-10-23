const API_URL = 'https://kindernote-backend.onrender.com/kindernote/api';
//const API_URL = 'http://localhost:8080/kindernote/api';

export async function generarBorrador(datos) {
    const respuesta = await fetch(
        `${API_URL}/alumno/generarBorrador`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        }
    );

    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        console.error('Error del backend:', respuesta.status, detalle);

        throw new Error(
            `Error ${respuesta.status}: ${detalle}`
        );
    }

    return await respuesta.text();
}

export async function getBorradores() {
    const respuesta = await fetch(`${API_URL}/informe`);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los informes.');
    }

    const informes = await respuesta.json();
    console.log('Informes recibidos:', informes);
    return informes.filter(informe => informe.esBorrador === true);
}

export async function getBorradoresPorMaestra(maestraId) {
    const respuesta = await fetch(
        `${API_URL}/informe/maestraId/?maestraId=${maestraId}`
    );

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
    return await respuesta.text();
}

export async function getAlumnos() {
    const respuesta = await fetch(`${API_URL}/alumno`);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los alumnos.');
    }

    return await respuesta.json();
}

export async function getAulas() {
    const respuesta = await fetch(`${API_URL}/aula`);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las aulas.');
    }

    return await respuesta.json();
}