import { useEffect, useState } from 'react';
import './Borrador.css';
import { ChevronLeft} from 'lucide-react';
import Nav from '../../components/Nav/Nav';
import {getBorradores , guardarBorrador} from '../../services/informeService';

function Borrador() {
    const [borradores, setBorradores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const aulas = [];
    const alumno = [];

    useEffect(() => {
        async function cargarBorradores() {
            try {
                const datos = await getBorradores();
                setBorradores(datos);
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        }
        cargarBorradores();
    }, []);


    function generarBorrador() {
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

        //enviar los datos a la API para generar el borrador

        const nuevoBorrador = {
            id: Date.now(),
            nombre: alumnoActual.nombre,
            apellido: alumnoActual.apellido || '',
            aula: aulaActual.nombre,
            fechaDesde,
            fechaHasta,
            fechaGeneracion: new Date().toLocaleDateString('es-AR'),
            contenido: 'El contenido generado aparecerá aquí.'
        };

        setBorradorActual(nuevoBorrador);
        setAbierto(true);
    }

    async function guardarBorradorActual() {
        if (!borradorActual) {
            alert('Primero tenés que generar un borrador.');
            return;
        }

        try {
            await guardarBorrador(borradorActual);
            alert('Borrador guardado correctamente.');
        } catch (error) {
            console.error(error);
            alert('No se pudo guardar el borrador.');
        }
    }

    const [aulaSeleccion, setAulaSeleccion] = useState('');
    const [alumnoSeleccion, setAlumnoSeleccion] = useState('');

    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const [borradorActual, setBorradorActual] = useState(null)
    
    const [abierto, setAbierto] = useState(false);

    /* DATOS DE PRUEBA
    const aulas = [
        { id: 1, nombre: 'Sala Roja' },
        { id: 2, nombre: 'Sala Azul' },
        { id: 3, nombre: 'Sala Verde' }
    ];
    const alumno = [
        { id: 1, nombre: 'nombre' },
        { id: 2, nombre: 'nombre2' },
        { id: 3, nombre: 'nombreyapellido?' }
    ];
    const borradores = [
        { nombre: 'Nombre', apellido:'apellido', fechaGeneracion:'10/10/10', contenido:'El contenido generado aparecerá aquí.' },
        { nombre: 'Nombre2', apellido:'apellido', fechaGeneracion:'10/10/10' },
        { nombre: 'Nombreyapellido?', apellido:'apellido', fechaGeneracion:'10/20/10' },
        { nombre: 'Nombre', apellido:'apellido', fechaGeneracion:'10/10/10' },
        { nombre: 'Nombre2', apellido:'apellido', fechaGeneracion:'10/10/10' },
        { nombre: 'Nombreyapellido?', apellido:'apellido', fechaGeneracion:'10/20/10' },
        { nombre: 'Nombre', apellido:'apellido', fechaGeneracion:'10/10/10' },
        { nombre: 'Nombre2', apellido:'apellido', fechaGeneracion:'10/10/10' },
        { nombre: 'Nombreyapellido?', apellido:'apellido', fechaGeneracion:'10/20/10' }
    ];
    */

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
                        <button className='boton-generar' type="button" onClick={generarBorrador}>Generar borrador</button>
                    </form>
                    
                    <div className='guardados-container'>
                        <p className='title-guardados'>BORRADORES GUARDADOS</p>
                        {borradores.map((borrador, index) => (
                            <button
                                className={`borrador-info ${
                                    borradorActual === borrador ? 'seleccionado' : ''
                                }`}
                                type="button"
                                key={index}
                                onClick={() => {
                                    setBorradorActual(borrador);
                                    setAbierto(true);
                                }}
                            >
                                <span className="info-nombre">
                                    {borrador.nombre} {borrador.apellido}
                                </span>

                                <span className="info-fecha">
                                    {borrador.fechaGeneracion}
                                </span>
                            </button>
                        ))}
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