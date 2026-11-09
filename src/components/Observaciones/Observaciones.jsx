import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight} from 'lucide-react';
import './Observaciones.css';
import { getEtiquetas, getObservacionesPorAlumno} from '../../services/observacionesService';
import {
    guardarObservacion,
    editarObservacion,
    eliminarObservacion
} from '../../services/observacionesService';

function Observaciones({alumnoId,maestraId,aula,alumno,onVolverAula,onVolverAulas}) {
    const navigate = useNavigate();
    
    const [nota, setNota] = useState('');
    const [fecha, setFecha] = useState('');
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState('');

    const [etiquetas, setEtiquetas] = useState([]);
    const [etiquetaFiltro, setEtiquetaFiltro] = useState(null);
    //const [cargandoEtiquetas, setCargandoEtiquetas] = useState(true);

    const [observaciones, setObservaciones] = useState([]);
    const [cargandoObservaciones, setCargandoObservaciones] = useState(true);
    const [errorObservaciones, setErrorObservaciones] = useState('');

    const [edicionAbierta, setEdicionAbierta] = useState(false);
    const [observacionEditando, setObservacionEditando] = useState(null);
    const [guardando, setGuardando] = useState(false);

    //OBSERVACIONES
    useEffect(() => {
        if (!alumnoId) {
            setObservaciones([]);
            setCargandoObservaciones(false);
            return;
        }
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
        if (!maestraId) return;

        async function cargarEtiquetas() {
            try {
                const datos = await getEtiquetas(maestraId);
                setEtiquetas(datos);
            } catch (error) {
                console.error(error);
            }
        }

        cargarEtiquetas();
    }, [maestraId]);
    
    const observacionesFiltradas = observaciones.filter(observacion => {
        if (etiquetaFiltro === null) return true;

        return observacion.etiquetaClave === etiquetaFiltro;
    });

    function limpiarFormulario() {
        setNota('');
        setFecha(new Date().toLocaleDateString('en-CA'));
        setEtiquetaSeleccionada('');
        setObservacionEditando(null);
    }

    function nuevaObservacion() {
        limpiarFormulario();
        setEdicionAbierta(true);
    }

    function cerrarEdicion() {
        setEdicionAbierta(false);
        limpiarFormulario();
    }

    function cargarObservacionParaEditar(observacion) {
        setNota(observacion.nota);
        setFecha(convertirFechaInput(observacion.fecha));
        setEtiquetaSeleccionada(observacion.etiquetaClave);

        setObservacionEditando(observacion);
        setEdicionAbierta(true);
    }

    async function handleGuardar() {
        if (!nota.trim() || !fecha || !etiquetaSeleccionada) {
            alert('Completá todos los campos.');
            return;
        }

        const etiqueta = etiquetas.find(
            e => e.clave === etiquetaSeleccionada
        );

        if (!etiqueta) {
            alert('Seleccioná una etiqueta válida.');
            return;
        }

        const datos = {
            alumnoId: Number(alumnoId),
            nota: nota.trim(),
            fecha,

            etiquetaTipo: etiqueta.tipo,
            etiquetaId: etiqueta.id,
            etiquetaValor: etiqueta.valor,
            etiqueta: etiqueta.nombre
        };

        try {
            setGuardando(true);

            if (observacionEditando) {
                await editarObservacion(observacionEditando.id, datos);
            } else {
                await guardarObservacion(datos);
            }

            // Volvemos a consultar para mantener los datos normalizados.
            const actualizadas = await getObservacionesPorAlumno(alumnoId);
            setObservaciones(actualizadas);

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

    function convertirFechaInput(fecha) {
        if (!fecha) return '';

        const [dia, mes, anio] = fecha.split('-');
        return `${anio}-${mes}-${dia}`;
    }

    return (
        <div className='observaciones'>
            <div className='header'>
                <div className='sala-actual'>
                    <button className='boton-volver' onClick={onVolverAulas}>
                        Mis aulas /
                    </button>

                    <button className='boton-volver' onClick={onVolverAula}>
                        {aula.nombre} /
                    </button>

                    <p>{alumno.nombre} {alumno.apellido}</p>
                    </div>
                <p className='id-alumno'>{alumno.nombre} {alumno.apellido}</p>
                <div className='info-alumno'>
                    <div className='data'>
                        <p className='id-aula'>{aula.nombre}</p>
                        <p>·</p>
                        <p className='fecha-nacimiento'>{alumno.fechaNacimiento}</p>
                        <p>·</p>
                        <p className='cant-observaciones'>{observaciones.length} observaciones</p>
                    </div>
                    <button className='generar-informe' onClick={() => navigate('/borradores')} >Generar informe<ChevronRight size={'15px'}/></button>
                </div>
            </div>
            <div className='body'>
                <div className={`edicion ${edicionAbierta ? 'abierta' : ''}`}>
                    <header>
                        <button className='cerrar' onClick={cerrarEdicion}>Cancelar</button>
                        <div className='title'>
                            {observacionEditando ? 'Editar observación' : 'Nueva observación'}
                        </div>
                        <div className='info'>
                            <p className='alumno'>{alumno.nombre} {alumno.apellido}</p>
                            <p>·</p>
                            <p className='sala'>{aula.nombre}</p>
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
                        <select
                            className="input"
                            id="etiqueta"
                            value={etiquetaSeleccionada}
                            onChange={(e) => setEtiquetaSeleccionada(e.target.value)}
                        >
                            <option value="">Seleccioná una etiqueta</option>

                            <optgroup label="Etiquetas predeterminadas">
                                {etiquetas
                                    .filter(e => e.tipo === 'PREDETERMINADA')
                                    .map(etiqueta => (
                                        <option key={etiqueta.clave} value={etiqueta.clave}>
                                            {etiqueta.nombre}
                                        </option>
                                    ))}
                            </optgroup>

                            <optgroup label="Mis etiquetas">
                                {etiquetas
                                    .filter(e => e.tipo === 'PERSONALIZADA')
                                    .map(etiqueta => (
                                        <option key={etiqueta.clave} value={etiqueta.clave}>
                                            {etiqueta.nombre}
                                        </option>
                                    ))}
                            </optgroup>
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
                <div className='observaciones-hechas'>
                    <div className='etiquetas'>
                        <button
                            className={`etiqueta-filtro ${etiquetaFiltro === null ? 'activa' : ''}`}
                            onClick={() => setEtiquetaFiltro(null)}
                        >
                            Todas
                        </button>

                        {etiquetas.map(etiqueta => (
                            <button
                                key={etiqueta.clave}
                                className={`etiqueta-filtro ${
                                    etiquetaFiltro === etiqueta.clave ? 'activa' : ''
                                }`}
                                onClick={() => setEtiquetaFiltro(etiqueta.clave)}
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
                                                        onClick={() => cargarObservacionParaEditar(observacion)}
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
            </div>
        </div>
    );
}

export default Observaciones