const API_URL = 'https://kindernote-backend.onrender.com/kindernote/api/maestra';

// Inicio de sesión
export async function iniciarSesion(datos) {
    const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: datos.email,
            contrasenia: datos.contrasenia
        })
    });

    if (!respuesta.ok) {
        if (respuesta.status === 404) {
            throw new Error('Email o contraseña incorrectos.');
        }

        throw new Error('No se pudo iniciar sesión. Intentá nuevamente.');
    }

    return respuesta.json();
}

// Registro
export async function registrarUsuario(datos) {
    const respuesta = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
            contrasenia: datos.contrasenia
        })
    });

    if (!respuesta.ok) {
        const mensaje = await respuesta.text();
        throw new Error(
            mensaje || `Error al registrar el usuario (${respuesta.status}).`
        );
    }

    // Algunos endpoints responden 201 Created sin contenido.
    if (respuesta.status === 204 || respuesta.status === 201) {
        return null;
    }

    return respuesta.text();
}