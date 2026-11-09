import { useEffect, useState } from 'react';
import './Borrador.css';
import { ChevronLeft } from 'lucide-react';
import Nav from '../../components/Nav/Nav';
import {
    getAlumnosPorAula,
    getBorradoresPorMaestra,
    generarBorrador,
    guardarBorrador,
    getBorradoresPorAlumno
} from '../../services/informeService';
import { getAulasPorMaestra } from '../../services/aulaService';
import { BotonExportarPdf } from '../../components/PDF/BotonExportarPdf';
import { BotonExportarDocx } from '../../components/DOCX/BotonExportarDocx';

function Borrador() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const usuarioId = usuario?.id;

    const [borradores, setBorradores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [aulas, setAulas] = useState([]);
    const [alumnos, setAlumnos] = useState([]);

    const [aulaSeleccion, setAulaSeleccion] = useState('');
    const [alumnoSeleccion, setAlumnoSeleccion] = useState('');

    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const [borradorActual, setBorradorActual] = useState(null);
    const [abierto, setAbierto] = useState(false);

    useEffect(() => {
        async function cargarDatos() {
            try {
                const [datosAulas] = await Promise.all([
                    getAulasPorMaestra(usuarioId)
                ]);
                setAulas(datosAulas);
            } catch (error) {
                console.error('Error al cargar aulas:', error);
                setError(error.message);
            }
        }
        cargarDatos();
    }, [usuarioId]);

    useEffect(() => {
        async function actualizarBorradores() {
            setBorradorActual(null);
            setBorradores([]);
            try {
                if (alumnoSeleccion !== "") {
                    const datos = await getBorradoresPorAlumno(alumnoSeleccion);
                    console.log('Primer borrador:', datos[0]);
                    setBorradores(datos);
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        }
        actualizarBorradores();
    }, [alumnoSeleccion]);

    useEffect(() => {
        async function actualizarAlumnos() {
            setBorradorActual(null);
            setBorradores([]);
            setAlumnoSeleccion('');
            try {
                if (aulaSeleccion === "") {
                    setAlumnos([]);
                } else {
                    const datosAlumnos = await getAlumnosPorAula(aulaSeleccion);
                    setAlumnos(datosAlumnos);
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        }
        actualizarAlumnos();
    }, [aulaSeleccion]);

    async function solicitarBorrador() {
        if (!aulaSeleccion || !alumnoSeleccion || !fechaDesde || !fechaHasta) {
            alert('Completá todos los campos para generar el borrador.');
            return;
        }

        if (fechaDesde > fechaHasta) {
            alert('La fecha Desde no puede ser posterior a Hasta.');
            return;
        }

        const alumnoActual = alumnos.find(
            (a) => String(a.id) === String(alumnoSeleccion)
        );
        const aulaActual = aulas.find(
            (a) => String(a.id) === String(aulaSeleccion)
        );

        if (!alumnoActual || !aulaActual) {
            alert('No se encontró el alumno o el aula seleccionados.');
            return;
        }

        try {
            const datos = {
                alumnoId: Number(alumnoSeleccion),
                fechaInicio: formatearFecha(fechaDesde),
                fechaFin: formatearFecha(fechaHasta)
            };
            const resultado = await generarBorrador(datos);

            const nuevoBorrador = {
                nombre: alumnoActual.nombre,
                apellido: alumnoActual.apellido || '',
                aula: aulaActual.nombre,
                fechaDesde,
                fechaHasta,
                fechaGeneracion: new Date().toLocaleDateString('es-AR'),
                contenido: resultado
            };
            
            setBorradorActual(nuevoBorrador);
            setAbierto(true);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    function formatearFecha(fecha) {
        const [anio, mes, dia] = fecha.split('-');
        return `${dia}-${mes}-${anio}`;
    }

    async function guardarBorradorActual() {
        if (!borradorActual) {
            alert('Primero tenés que generar un borrador.');
            return;
        }

        try {
            const informe = {
                texto: borradorActual.contenido,
                fechaCreacion: formatearFecha(
                    new Date().toLocaleDateString('en-CA')
                ),
                esBorrador: true,
                alumno: {
                    id: Number(alumnoSeleccion)
                }
            };

            await guardarBorrador(informe);
            alert('Borrador guardado correctamente.');

            const informesActualizados = await getBorradoresPorMaestra();
            setBorradores(informesActualizados);
        } catch (error) {
            console.error(error);
            alert('No se pudo guardar el borrador.');
        }
    }

    // Buscamos de forma segura al alumno seleccionado actualmente
    const alumnoSeleccionadoObj = alumnos.find(
        (a) => String(a.id) === String(alumnoSeleccion)
    );
    const aulaSeleccionadaObj = aulas.find(
        (a) => String(a.id) === String(aulaSeleccion)
    );

    return (
        <div className='borrador'>
            <div className={`principal ${abierto ? '' : 'abierto'}`}>
                <div className='borrador-container'>
                    <p className='borrador-title'>Informes</p>
                    <p className='borrador-title-desktop'>Informe del alumno</p>

                    <form className='borrador-form'>
                        <div className="seleccion">
                            <label className="seleccion-title" htmlFor="aula">Aula</label>
                            <select className="input" id="aula" value={aulaSeleccion} onChange={(e) => setAulaSeleccion(e.target.value)}>
                                <option value="">Seleccioná un aula</option>
                                {aulas.map((aula) => (<option key={aula.id} value={aula.id}>{aula.nombre}</option>))}
                            </select>
                        </div>

                        <div className="seleccion">
                            <label className="seleccion-title" htmlFor="alumno">Alumno</label>
                            <select className="input" id="alumno" value={alumnoSeleccion} onChange={(e) => setAlumnoSeleccion(e.target.value)}>
                                <option value="">Seleccioná un alumno</option>
                                {alumnos.map((alumno) => (<option key={alumno.id} value={alumno.id}>{alumno.nombre}</option>))}
                            </select>
                        </div>

                        <div className='seleccion-fechas'>
                            <div className="seleccion">
                                <label className="seleccion-title" htmlFor="fechaDesde">Desde</label>
                                <input
                                    className="input"
                                    type="date"
                                    id="fechaDesde"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                />
                            </div>
                            <div className="seleccion">
                                <label className="seleccion-title" htmlFor="fechaHasta">Hasta</label>
                                <input
                                    className="input"
                                    type="date"
                                    id="fechaHasta"
                                    value={fechaHasta}
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className='boton-generar' type="button" onClick={solicitarBorrador}>Generar borrador</button>
                    </form>
                    
                    <div className='guardados-container'>
                        <p className='title-guardados'>BORRADORES GUARDADOS</p>
                        {borradores.map((borrador) => {
                            const alumnoBorrador = alumnos.find(a => a.id === borrador.alumno?.id) || alumnoSeleccionadoObj;

                            return (
                                <button
                                    className="borrador-info"
                                    key={borrador.id}
                                    type="button"
                                    onClick={() => {
                                        setBorradorActual({
                                            ...borrador,
                                            nombre: alumnoBorrador?.nombre || 'Alumno',
                                            apellido: alumnoBorrador?.apellido || '',
                                            contenido: borrador.texto || "Fix: Placeholder",
                                            fechaGeneracion: borrador.fechaCreacion,
                                            textoPorArea: borrador.textoPorArea
                                        });
                                        setAbierto(true);
                                    }}
                                >
                                    <span className="info-nombre">
                                        {alumnoBorrador
                                            ? `${alumnoBorrador.nombre} ${alumnoBorrador.apellido || ''}`
                                            : 'Alumno'}
                                    </span>
                                    <span className="info-fecha">
                                        {borrador.fechaCreacion}
                                    </span>
                                </button>
                            );
                        })}
                        {cargando && <p>Cargando borradores...</p>}
                        {!cargando && error && <p>{error}</p>}
                        {!cargando && !error && borradores.length === 0 && (
                            <p>No hay borradores guardados.</p>
                        )}
                    </div>
                </div>
                <Nav/>
            </div>
            <div className='guardar-desktop'>
                <div className={`guardar-container ${abierto ? 'abierto' : ''}`}>
                    <button className="volver-button" type="button" onClick={() => setAbierto(false)}><ChevronLeft/>Informes</button>
                    <div className='guardar-info'>
                        <p>Borrador generado</p>
                        <p className='info-nombre'>{borradorActual?.nombre} {borradorActual?.apellido}</p>
                        <p className='info-fecha'>{borradorActual?.fechaGeneracion}</p>
                    </div>
                    <div className='texto-generado'>
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            {borradorActual?.contenido}
                        </div>
                    </div>
                </div>
                <div className={`footer-botones ${abierto ? 'abierto' : ''}`}>
                    <button className='boton-guardar' type="button" onClick={guardarBorradorActual}>Guardar borrador</button>
                    <div className='exportar-borrador'>
                        {borradorActual && alumnoSeleccionadoObj ? (
                            <BotonExportarPdf 
                                alumno={alumnoSeleccionadoObj}
                                maestra={usuario}
                                aulaNombre={aulaSeleccionadaObj?.nombre}
                                informe={borradorActual}
                            />
                        ) : (
                            <button className='boton-exportar' type="button" disabled={true}>Exportar PDF</button>
                        )}
                        {borradorActual && alumnoSeleccionadoObj ? (
                            <BotonExportarDocx 
                                alumno={alumnoSeleccionadoObj}
                                maestra={usuario}
                                aulaNombre={aulaSeleccionadaObj?.nombre}
                                informe={borradorActual}
                            />
                        ) : (
                            <button className='boton-exportar' type="button" disabled={true}>Exportar DOCX</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Borrador;