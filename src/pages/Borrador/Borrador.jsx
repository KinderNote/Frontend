import { useEffect, useState } from 'react';
import './Borrador.css';
import { ChevronLeft } from 'lucide-react';
import Nav from '../../components/Nav/Nav';
import {
    getAlumnosPorAula,
    generarBorrador,
    guardarBorrador,
    getBorradoresPorAlumno,
    textosToItems,
    itemsToTextos
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

    const [areas, setAreas] = useState([])

    const [loading, setLoading] = useState(false)

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

    useEffect (() => {
        if (borradorActual) {
            const textos = textosToItems(JSON.parse(JSON.stringify(borradorActual.textoPorArea)))
            console.log("textos: ", textos)
            setAreas(textos);
            //console.log(itemsToTextos(textos))
        }
        else {
            setAreas([])
        }
        
    }, [borradorActual])

    const manejarTextoCambiado = (index, nuevoTexto) => {
        setAreas((prevAreas) => {
            const nuevasAreas = [...prevAreas];
            nuevasAreas[index] = {
                ...nuevasAreas[index],
                texto: nuevoTexto
            };
            return nuevasAreas;
        })
    }

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
                setAbierto(false)
            }
        }
        actualizarBorradores();
    }, [alumnoSeleccion]);

    useEffect(() => {
        async function actualizarAlumnos() {
            setBorradorActual(null);
            setBorradores([]);
            setAlumnoSeleccion('');
            setAbierto(false)
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
            //console.log("alumnos: ", alumnos)
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
            setLoading(true)

            const datos = {
                alumnoId: alumnoSeleccionadoObj.id,
                fechaInicio: formatearFecha(fechaDesde),
                fechaFin: formatearFecha(fechaHasta)
            };
            
            const resultado = await generarBorrador(datos);

            borradores.push(resultado)
            setBorradores(borradores)
            setBorradorActual(resultado);
            setAbierto(true)
            
        } catch (error) {
            console.error(error);
            alert("No se pudo generar el borrador");
        }
        finally {
            setLoading(false)
        }
    }

    function formatearFecha(fecha) {
        const [anio, mes, dia] = fecha.split('-');
        return `${dia}-${mes}-${anio}`;
    }

    function areasValidas() {
        return areas.every(areaValida)
    }

    function areaValida(area) {
        console.log("area: ", area.texto)
        if (area.texto) {
            return true
        }
        else {
            return false
        }
    }

    async function guardarBorradorActual() {
        if (!borradorActual) {
            alert('Primero tenés que generar un borrador.');
            return;
        }

        if (!areasValidas()) {
            alert('Ninguna sección del informe debe estar vacía.');
            return;
        }

        try {
            const informe = {
                textoPorArea: itemsToTextos(areas),
                fechaCreacion: borradorActual.fechaCreacion,
                esBorrador: true,
                id: borradorActual.id
            };
            await guardarBorrador(informe);
            alert('Borrador guardado correctamente.');

            setBorradorActual(informe)
            //const informesActualizados = await getBorradoresPorMaestra();
            //setBorradores(informesActualizados);
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
                        <button className='boton-generar' type="button" disabled={loading} onClick={solicitarBorrador}>{!loading ? "Generar borrador" : "Generando"}</button>
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
                                            
                                            fechaGeneracion: borrador.fechaCreacion,
                                            textoPorArea: borrador.textoPorArea
                                        });
                                        setAbierto(true);
                                        //cambiarTextos(borradorActual)
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
                    {abierto ? (<div className='guardar-info'>
                        <p>Borrador generado</p>
                        <p className='info-nombre'>{alumnoSeleccionadoObj?.nombre} {alumnoSeleccionadoObj?.apellido}</p>
                        <p className='info-fecha'>{borradorActual?.fechaCreacion}</p>
                    </div>) : (<div className='guardar-info'/>)}
                    <div className='texto-generado'>
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            <p style={{ color: '#666', fontSize: '14px', font: '500 14px Lexend-Regular, sans-serif' }}>
                                {!abierto ? "Para generar un borrador:\n1. Seleccione el aula a la que pertenece el alumno.\n2. seleccione el alumno al que le va a generar un borrador.\n3. Seleccione las fechas de inicio y fin para usar las anotaciones del alumno creadas entre esas fechas.\n4. Pulse el botón generar borrador y espere a que el borrador esté listo.\n\nPara editar un borrador generado previamente:\n1. Seleccione el aula a la que pertenece el alumno.\n2. Seleccione el alumno.\n3. Seleccione el borrador del alumno a editar en la sección inferior.\n4. Se visualizará el borrador en la sección derecha de la pantalla para editar." : "Puede exportar el informe a PDF o DOCX usando los botones de arriba o puede modificar el texto de cada área según sea necesario. Asegúrese de presionar el botón de gauardar borrador para haccer efectivos los cambios."}
                            </p>

                            {areas.map((item, index) => (
                                <div 
                                    key={index} 
                                    style={{ 
                                        marginBottom: '20px', 
                                        padding: '15px', 
                                        border: '1px solid #e2f0e3', 
                                        borderRadius: '8px',
                                        backgroundColor: '#f7fcf9' 
                                    }}
                                >

                                    <label style={{ 
                                        display: 'block', 
                                        fontWeight: 'bold', 
                                        color: '#1F5B37', 
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        fontSize: '13px',
                                        font: '500 15px Lexend-Regular, sans-serif'
                                    }}>
                                        {item.area}
                                    </label>

                                    <textarea
                                        value={item.texto}
                                        onChange={(e) => manejarTextoCambiado(index, e.target.value)}
                                        rows={5}
                                        style={{
                                        width: '100%',
                                        padding: '10px',
                                        fontSize: '14px',
                                        borderRadius: '4px',
                                        border: '1px solid #CBD5E0',
                                        fontFamily: 'inherit',
                                        lineHeight: '1.5',
                                        resize: 'vertical',
                                        boxSizing: 'border-box',
                                        font: '500 14px Lexend-Regular, sans-serif'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={`footer-botones ${abierto ? 'abierto' : ''}`}>
                    <button className='boton-guardar' type="button" disabled={!abierto} onClick={guardarBorradorActual}>Guardar borrador</button>
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