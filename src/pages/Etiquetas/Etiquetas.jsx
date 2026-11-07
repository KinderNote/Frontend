import { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import './Etiquetas.css';
import Nav from '../../components/Nav/Nav';
import { getEtiquetasPorMaestra, crearEtiqueta, eliminarEtiqueta } from '../../services/etiquetaService';

function Etiquetas() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const usuarioId = usuario?.id;

    const [etiquetas, setEtiquetas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [nombre, setNombre] = useState('');

    const cargarEtiquetas = useCallback(async () => {
        try {
            if (!usuarioId) {
                throw new Error('No se encontró la maestra de la sesión.');
            }
            setEtiquetas(await getEtiquetasPorMaestra(usuarioId));
            setError('');
        } catch (e) {
            console.error('Error al cargar etiquetas:', e);
            setError(e.message);
        } finally {
            setCargando(false);
        }
    }, [usuarioId]);

    useEffect(() => {
        cargarEtiquetas();
    }, [cargarEtiquetas]);

    async function crear(e) {
        e.preventDefault();
        const nombreLimpio = nombre.trim();
        if (!nombreLimpio) return;

        if (etiquetas.some((et) => et.nombre.toLowerCase() === nombreLimpio.toLowerCase())) {
            setError('Ya existe una etiqueta con ese nombre.');
            return;
        }

        try {
            await crearEtiqueta(nombreLimpio, usuarioId);
            setNombre('');
            await cargarEtiquetas();
        } catch (e) {
            setError(e.message);
        }
    }

    async function eliminar(etiqueta) {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar "${etiqueta.nombre}"?`)) return;

        try {
            await eliminarEtiqueta(etiqueta.id);
            await cargarEtiquetas();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div className='etiquetas-container'>
            <div className='etiquetas-contenido'>
                <div className='etiquetas-encabezado'>
                    <span className='etiquetas-kicker'>Sectores de desarrollo</span>
                    <h1 className='etiquetas-title'>Etiquetas</h1>
                    <p className='etiquetas-subtitulo'>
                        Agrupan las anotaciones por sector de desarrollo. Las usa el borrador del informe.
                    </p>
                </div>

                <form className='etiquetas-form' onSubmit={crear}>
                    <label className='etiquetas-label' htmlFor='sector'>
                        <span>Sector <span className='etiquetas-req'>*</span></span>
                        <input
                            id='sector'
                            className='etiquetas-input'
                            type='text'
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder='Expresión artística'
                            required
                        />
                    </label>
                    <button className='etiquetas-boton' type='submit'>
                        <span className='etiquetas-boton-mobile'>Crear</span>
                        <span className='etiquetas-boton-desktop'>Crear etiqueta</span>
                    </button>
                </form>

                {error && <p className='etiquetas-error'>{error}</p>}
                {cargando && <p className='etiquetas-aviso'>Cargando etiquetas...</p>}
                {!cargando && !error && etiquetas.length === 0 && (
                    <p className='etiquetas-aviso'>Todavía no tenés etiquetas. Creá la primera.</p>
                )}

                {etiquetas.length > 0 && (
                    <div className='etiquetas-lista'>
                        {etiquetas.map((etiqueta) => (
                            <div className='etiquetas-fila' key={etiqueta.id}>
                                <span className={`etiquetas-chip etiquetas-chip-${(etiqueta.id % 5) + 1}`}>
                                    {etiqueta.nombre}
                                </span>
                                <span className='etiquetas-cantidad'>
                                    {etiqueta.cantidadAnotaciones ?? 0}
                                    <span className='etiquetas-cantidad-desktop'> anotaciones</span>
                                </span>
                                <button
                                    className='etiquetas-eliminar'
                                    type='button'
                                    aria-label={`Eliminar ${etiqueta.nombre}`}
                                    onClick={() => eliminar(etiqueta)}
                                >
                                    <Trash2 size={20} className='etiquetas-eliminar-icono' />
                                    <span className='etiquetas-eliminar-texto'>Eliminar</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <p className='etiquetas-nota'>El número es la cantidad de anotaciones con esa etiqueta.</p>
            </div>
            <Nav />
        </div>
    );
}

export default Etiquetas;
