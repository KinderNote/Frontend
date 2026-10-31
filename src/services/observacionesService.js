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

const observacionesPrueba = [
    {
        id: 1,
        fecha: '2026/10/28',
        nota: 'Participó activamente en la actividad de lectura. Reconoció nuevas palabras y compartió sus ideas con el grupo.',
        alumnoId: 1,
        etiqueta: 'Lenguaje'
    },
    {
        id: 2,
        fecha: '2026/10/26',
        nota: 'Compartió los materiales con sus compañeros durante la actividad grupal.',
        alumnoId: 2,
        etiqueta: 'Socialización'
    },
    {
        id: 3,
        fecha: '2026/10/24',
        nota: 'Logró realizar la actividad de encastre sin ayuda de la docente.',
        alumnoId: 3,
        etiqueta: 'Motricidad'
    },
    {
        id: 4,
        fecha: '2026/10/22',
        nota: 'Mostró interés por contar experiencias personales durante la ronda.',
        alumnoId: 1,
        etiqueta: 'Lenguaje'
    },
    {
        id: 5,
        fecha: '2026/10/20',
        nota: 'Comenzó a organizar sus pertenencias de manera autónoma.',
        alumnoId: 4,
        etiqueta: 'Autonomía'
    }
];

export async function getObservacionesPorAlumno(alumnoId) {

    // Simulamos una pequeña demora del servidor.
    await new Promise(resolve => setTimeout(resolve, 500));

    return observacionesPrueba;
}