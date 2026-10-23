import { useEffect, useState } from 'react';
import './Borrador.css';
import { ChevronLeft} from 'lucide-react';
import Nav from '../../components/Nav/Nav';
import {
    getAlumnos,
    getAulas,
    getBorradoresPorMaestra,
    generarBorrador,
    guardarBorrador
} from '../../services/informeService';

function Borrador() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const [borradores, setBorradores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [aulas, setAulas] = useState([]);
    const [alumno, setAlumno] = useState([]);

    const [aulaSeleccion, setAulaSeleccion] = useState('');
    const [alumnoSeleccion, setAlumnoSeleccion] = useState('');

    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const [borradorActual, setBorradorActual] = useState(null)
    
    const [abierto, setAbierto] = useState(false);

    useEffect(() => {
        async function cargarDatos() {
            try {
                const [datosAlumnos, datosAulas] = await Promise.all([
                    getAlumnos(),
                    getAulas()
                ]);

                setAlumno(datosAlumnos);
                setAulas(datosAulas);
            } catch (error) {
                console.error('Error al cargar alumnos y aulas:', error);
                setError(error.message);
            }
        }
        cargarDatos();
    }, []);

    useEffect(() => {
        async function cargarBorradores() {
            try {
                const usuario = JSON.parse(
                    localStorage.getItem('usuario')
                );

                if (!usuario?.id) {
                    throw new Error('No se encontró la maestra de la sesión.');
                }

                const datos = await getBorradoresPorMaestra(usuario.id);
                //console.log('Borradores recibidos:', datos);
                //console.log('Primer borrador:', datos[0]);
                setBorradores(datos);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        }
        cargarBorradores();
    }, []);

    async function solicitarBorrador() {
        if (!aulaSeleccion || !alumnoSeleccion || !fechaDesde || !fechaHasta) {
            alert('Completá todos los campos para generar el borrador.');
            return;
        }

        if (fechaDesde > fechaHasta) {
            alert('La fecha Desde no puede ser posterior a Hasta.');
            return;
        }

        const alumnoActual = alumno.find(
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
            //console.log('Datos enviados al backend:', datos);
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

    return(
        <div className='borrador'>
            <div className={`principal ${abierto ? '' : 'abierto'}`}>
                <div className='borrador-container'>
                    <p className='borrador-title'>Informes</p>
                    <p className='borrador-title-desktop'>Informe del alumno</p>

                    <form className='borrador-form'>

                        <div className="seleccion">
                            <label className ="seleccion-title" htmlFor="aula">Aula</label>
                            <select className="input" id="aula" value={aulaSeleccion} onChange={(e) => setAulaSeleccion(e.target.value)}>
                                <option value="">Seleccioná un aula</option>{aulas.map((aula) => (<option key={aula.id} value={aula.id}>{aula.nombre}</option>))}
                            </select>
                        </div>

                        <div className="seleccion">
                            <label className ="seleccion-title" htmlFor="alumno">Alumno</label>
                            <select className="input" id="alumno" value={alumnoSeleccion} onChange={(e) => setAlumnoSeleccion(e.target.value)}>
                                <option value="">Seleccioná un alumno</option>{alumno.map((alumno) => (<option key={alumno.id} value={alumno.id}>{alumno.nombre}</option>))}
                            </select>
                        </div>

                        <div className='seleccion-fechas'>
                            <div className="seleccion">
                                <label className ="seleccion-title" htmlFor="fechaDesde">Desde</label>
                                <input
                                    className="input"
                                    type="date"
                                    id="fechaDesde"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                />
                            </div>
                            <div className="seleccion">
                                <label className ="seleccion-title" htmlFor="fechaHasta">Hasta</label>
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
                            const alumnoBorrador = alumno.find(
                                (a) => String(a.id) === String(borrador.alumno?.id)
                            );

                            return (
                                <button
                                    className="borrador-info"
                                    key={borrador.id}
                                    type="button"
                                    onClick={() => {
                                        setBorradorActual({
                                            ...borrador,
                                            nombre: alumnoBorrador?.nombre || 'Alumno no encontrado',
                                            apellido: alumnoBorrador?.apellido || '',
                                            contenido: borrador.texto,
                                            fechaGeneracion: borrador.fechaCreacion
                                        });

                                        setAbierto(true);
                                    }}
                                >
                                    <span className="info-nombre">
                                        {alumnoBorrador
                                            ? `${alumnoBorrador.nombre} ${alumnoBorrador.apellido || ''}`
                                            : 'Alumno no encontrado'}
                                    </span>

                                    <span className="info-fecha">
                                        {borrador.fechaCreacion}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <Nav/>
            </div>
            <div className='guardar-desktop'>
                <div className={`guardar-container ${abierto ? 'abierto' : ''}`}>
                    <button className="volver-button" type="button" onClick={() => setAbierto(false)}><ChevronLeft/>Informes</button>
                    <div className='guardar-info'>
                        <p >Borrador generado</p>
                        <p className='info-nombre'>{borradorActual?.nombre} {borradorActual?.apellido}</p>
                        <p className='info-fecha'>{borradorActual?.fechaGeneracion}</p>
                    </div>
                    <div className='texto-generado'>
                        <text>
                            {borradorActual?.contenido}
                        </text>
                    </div>
                </div>
                <div className={`footer-botones ${abierto ? 'abierto' : ''}`}>
                    <button className='boton-guardar' type="button"onClick={guardarBorradorActual}>Guardar borrador</button>
                    <div className='exportar-borrador'>
                        <button className='boton-generar' type="button">Exportar PDF</button>
                        <button className='boton-generar' type="button">Exportar DOCX</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Borrador;