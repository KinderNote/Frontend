import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight} from 'lucide-react';
import './Observaciones.css';
import { getEtiquetas, getObservacionesPorAlumno} from '../../services/observacionesService';
import {
    guardarObservacion,
    editarObservacion,
    eliminarObservacion
} from '../../services/observacionesService';

function Observaciones() {
    const [alumnoId, setAlumnoId] = useState('');
    const [nota, setNota] = useState('');
    const [fecha, setFecha] = useState('');
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState('');

    const [etiquetas, setEtiquetas] = useState([]);
    const [etiquetaFiltro, setEtiquetaFiltro] = useState(null);
    const [cargandoEtiquetas, setCargandoEtiquetas] = useState(true);

    const [observaciones, setObservaciones] = useState([]);
    const [cargandoObservaciones, setCargandoObservaciones] = useState(true);
    const [errorObservaciones, setErrorObservaciones] = useState('');

    const [edicionAbierta, setEdicionAbierta] = useState(false);
    const [observacionEditando, setObservacionEditando] = useState(null);
    const [guardando, setGuardando] = useState(false);

    //OBSERVACIONES
    useEffect(() => {
        async function cargarObservaciones() {
            try {
                setCargandoObservaciones(true);
                setErrorObservaciones('');
                const datos = await getObservacionesPorAlumno(alumnoId);
                setObservaciones(datos);
            } catch (error) {
                console.error(error);
                setErrorObservaciones('No se pudieron cargar las observaciones.');
            } finally {
                setCargandoObservaciones(false);
            }
        }
        cargarObservaciones();
    }, [alumnoId]);

    //ETIQUETAS
    useEffect(() => {
        async function cargarEtiquetas() {
            try {
                const datos = await getEtiquetas();
                setEtiquetas(datos);
            } catch (error) {
                console.error(error);
            } finally {
                setCargandoEtiquetas(false);
            }
        }
        cargarEtiquetas();
    }, []);
    
    const observacionesFiltradas = observaciones.filter((observacion) => {
        if (etiquetaFiltro === null) return true;

        return observacion.alumnoId === etiquetaFiltro;
    });

    function nuevaObservacion() {
        setNota('');
        setFecha(new Date().toLocaleDateString('en-CA'));
        setEtiquetaSeleccionada('');

        setObservacionEditando(null);
        setEdicionAbierta(true);
    }

    function editarObservacion(observacion) {
        setNota(observacion.nota);
        setFecha(observacion.fecha);
        setEtiquetaSeleccionada(observacion.etiquetaId);

        setObservacionEditando(observacion);
        setEdicionAbierta(true);
    }

    function cerrarEdicion() {
        setEdicionAbierta(false);
        setObservacionEditando(null);
    }

    async function handleGuardar() {
        if (!nota.trim() || !fecha || !etiquetaSeleccionada) {
            alert('Completá todos los campos.');
            return;
        }

        const etiqueta = etiquetas.find(
            e => Number(e.id) === Number(etiquetaSeleccionada)
        );

        const datos = {
            alumnoId: Number(alumnoId),
            nota: nota.trim(),
            fecha: fecha,
            etiquetaId: Number(etiquetaSeleccionada),
            etiqueta: etiqueta.nombre
        };

        try {
            setGuardando(true);

            if (observacionEditando) {
                // Modificar observación existente
                const actualizada = await editarObservacion(
                    observacionEditando.id,
                    datos
                );

                setObservaciones(prev =>
                    prev.map(obs =>
                        obs.id === actualizada.id ? actualizada : obs
                    )
                );

            } else {
                // Crear observación nueva
                const nueva = await guardarObservacion(datos);

                setObservaciones(prev => [...prev, nueva]);
            }

            cerrarEdicion();

        } catch (error) {
            console.error(error);
            alert('No se pudo guardar la observación.');

        } finally {
            setGuardando(false);
        }
    }

    async function handleEliminar(id) {
        const confirmar = window.confirm(
            '¿Estás seguro de que querés eliminar esta observación?'
        );

        if (!confirmar) return;

        try {
            await eliminarObservacion(id);

            setObservaciones(prev =>
                prev.filter(obs => obs.id !== id)
            );

        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar la observación.');
        }
    }

    return (
        <div className='observaciones'>
            <div className='header'>
                <button className='volver-aula'><ChevronLeft size={'15px'}/>Nombreaula</button>
                <p className='id-alumno'>Benicio</p>
                <div className='info-alumno'>
                    <div className='data'>
                        <p className='id-aula'>Nombreaula</p>
                        <p className='fecha-nacimiento'>10/10/10</p>
                        <p className='cant-observaciones'>anotaciones</p>
                    </div>
                    <button className='generar-informe'>Generar informe<ChevronRight size={'15px'}/></button>
                </div>
            </div>
            <div className='body'>
                <div className='observaciones-hechas'>
                    <div className='etiquetas'>
                        <button
                            className={`etiqueta-filtro ${etiquetaFiltro === null ? 'activa' : ''}`}
                            onClick={() => setEtiquetaFiltro(null)}
                        >
                            Todas
                        </button>
                            {etiquetas.map((etiqueta) => (
                            <button
                                key={etiqueta.id}
                                className={`etiqueta-filtro ${etiquetaFiltro === etiqueta.id ? 'activa' : ''}`}
                                onClick={() => setEtiquetaFiltro(etiqueta.id)}
                            >
                                {etiqueta.nombre}
                            </button>
                        ))}
                    </div>
                    <div className='tarjetas'>
                        {cargandoObservaciones && <p>Cargando observaciones...</p>}
                        {errorObservaciones && <p>{errorObservaciones}</p>}
                        {!cargandoObservaciones && !errorObservaciones && (
                            <>
                                {observacionesFiltradas.length === 0 ? (
                                    <p>No hay observaciones para mostrar.</p>
                                ) : (
                                    observacionesFiltradas.map((observacion) => (
                                        <div className='tarjeta' key={observacion.id}>
                                            <div className='tarjeta-header'>
                                                <div className='fecha'>
                                                    {observacion.fecha}
                                                </div>
                                                <div className='etiqueta'>
                                                    {observacion.etiqueta}
                                                </div>
                                                <div className='acciones'>
                                                    <button
                                                        className='editar'
                                                        onClick={() => editarObservacion(observacion)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <p>·</p>
                                                    <button
                                                        className='borrar'
                                                        onClick={() => handleEliminar(observacion.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='texto'>
                                                {observacion.nota}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </div>
                </div>

                <button className='anotar' onClick={nuevaObservacion}>+ Anotar</button>

                <div className={`edicion ${edicionAbierta ? 'abierta' : ''}`}>
                    <header>
                        <button className='cerrar' onClick={cerrarEdicion}>Cancelar</button>
                        <div className='title'>
                            {observacionEditando ? 'Editar observación' : 'Nueva observación'}
                        </div>
                        <div className='info'>
                            <p className='alumno'>Benicio</p>
                            <p>·</p>
                            <p className='sala'>Sala autista</p>
                        </div>
                    </header>
                    <div className="seleccion">
                        <label className="seleccion-title" htmlFor="nota">Nota</label>
                        <textarea
                            className="input"
                            id="nota"
                            value={nota}
                            onChange={(e) => setNota(e.target.value)}
                            placeholder="Escribí una observación sobre el alumno..."
                        />
                    </div>
                    <div className="seleccion">
                        <label className="seleccion-title" htmlFor="fecha">
                            Fecha
                        </label>
                        <input
                            className="input"
                            type="date"
                            id="fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                    <div className="seleccion">
                        <label className ="seleccion-title" htmlFor="etiqueta">Etiqueta</label>
                        <select
                            className="input"
                            id="etiqueta"
                            value={etiquetaSeleccionada}
                            onChange={(e) => setEtiquetaSeleccionada(e.target.value)}
                        >
                            <option value="">Seleccioná una etiqueta</option>
                            {etiquetas.map((etiqueta) => (
                                <option key={etiqueta.id} value={etiqueta.id}>
                                    {etiqueta.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className='guardar'
                        onClick={handleGuardar}
                        disabled={guardando}
                    >
                        {guardando ? 'Guardando...' : 'Guardar anotación'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Observaciones