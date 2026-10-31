import { useState, useEffect } from 'react';
import './Observaciones.css';
import { getEtiquetas, getObservacionesPorAlumno} from '../../services/observacionesService';

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
    return (
        <div className='observaciones'>
            <div className='header'>
                <button className='volver-aula'>Nombreaula</button>
                <p className='id-alumno'>Benicio</p>
                <div className='info-alumno'>
                    <div className='data'>
                        <p className='id-aula'>Nombreaula</p>
                        <p className='fecha-nacimiento'>10/10/10</p>
                        <p className='cant-observaciones'>anotaciones</p>
                    </div>
                    <button className='generar-informe'>Generar informe</button>
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
                                                    <button className='editar'>Editar</button>
                                                    <p>·</p>
                                                    <button className='borrar'>Eliminar</button>
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
                <button className='anotar'>+ Anotar</button>
                <div className='nueva-observacion'>
                    <div className='title'></div>
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
                        <button className='guardar'>Guardar anotación</button>
                </div>
            </div>
        </div>
    );
}

export default Observaciones