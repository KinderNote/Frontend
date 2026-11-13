const API_URL = 'https://kindernote-backend.onrender.com/kindernote/api/alumno';
//const API_URL = 'http://localhost:8080/kindernote/api/alumno';

function convertirFechaBackend(fecha) {
    if (!fecha) return null;

    const [anio, mes, dia] = fecha.split('-');
    return `${dia}-${mes}-${anio}`;
}

// Obtener todos los alumnos
export async function getAlumnos() {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los alumnos.');
    }

    return await respuesta.json();
}

export async function getAlumnosPorAula(aulaId) {
    const respuesta = await fetch(`${API_URL}/getAllByAula/${aulaId}`);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los alumnos.');
    }

    return await respuesta.json();
}

// Crear alumno
export async function crearAlumno(alumno, aulaId) {
    const datos = {
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        fechaNacimiento: convertirFechaBackend(alumno.fechaNacimiento),
        aula: {
            id: aulaId
        }
    };

    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo crear el alumno.');
    }

    return await respuesta.text();
}

// Editar alumno
export async function editarAlumno(alumno, aulaId) {
    const datos = {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        fechaNacimiento: convertirFechaBackend(alumno.fechaNacimiento),
        aula: {
            id: aulaId
        }
    };

    const respuesta = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo editar el alumno.');
    }

    return await respuesta.text();
}

// Eliminar alumno
export async function eliminarAlumno(id) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo eliminar el alumno.');
    }

    return await respuesta.text();
}
