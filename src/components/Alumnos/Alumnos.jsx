import React, { useState, useEffect } from 'react';
import './Alumnos.css';
import {
  getAlumnos,
  crearAlumno,
  editarAlumno,
  eliminarAlumno as eliminarAlumnoApi
} from '../../services/alumnoService';
import Observaciones from '../Observaciones/Observaciones';

function Alumnos({ aula, onVolver, maestraId }) {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [idEditando, setIdEditando] = useState(null);

  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

  useEffect(() => {
    async function cargarAlumnos() {
      try {
        setCargando(true);
        setError("");

        const datos = await getAlumnos();

        const alumnosDelAula = datos.filter(
          alumno => Number(alumno.aula?.id) === Number(aula.id)
        );

        setAlumnos(alumnosDelAula);

      } catch (error) {
        console.error("Error al cargar alumnos:", error);
        setError("No se pudieron cargar los alumnos.");
      } finally {
        setCargando(false);
      }
    }

    cargarAlumnos();
  }, [aula.id]);

  const abrirPanelCrear = () => {
    setNombre("");
    setApellido("");
    setFechaNacimiento("");
    setIdEditando(null);
    setMostrarPanel(true);
  };

  const abrirPanelEditar = (alumno) => {
    setNombre(alumno.nombre);
    setApellido(alumno.apellido);
    setFechaNacimiento(convertirFechaInput(alumno.fechaNacimiento));
    setIdEditando(alumno.id);
    setMostrarPanel(true);
  };

  const guardarAlumno = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !apellido.trim() || !fechaNacimiento) return;

    try {
      const alumno = {
        id: idEditando,
        nombre,
        apellido,
        fechaNacimiento
      };

      if (idEditando !== null) {
        await editarAlumno(alumno, aula.id);
      } else {
        await crearAlumno(alumno, aula.id);
      }

      // Volvemos a consultar los alumnos del backend.
      const datos = await getAlumnos();

      setAlumnos(
        datos.filter(a => Number(a.aula?.id) === Number(aula.id))
      );

      setMostrarPanel(false);
      setNombre("");
      setApellido("");
      setFechaNacimiento("");
      setIdEditando(null);

    } catch (error) {
      console.error("Error al guardar alumno:", error);
      setError("No se pudo guardar el alumno.");
    }
  };

  const eliminarAlumno = async (id, nombreCompleto) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar a "${nombreCompleto}"?`)) {
      return;
    }

    try {
      await eliminarAlumnoApi(id);

      setAlumnos(alumnos.filter(a => a.id !== id));

    } catch (error) {
      console.error("Error al eliminar alumno:", error);
      setError("No se pudo eliminar el alumno.");
    }
  };

  function formatearFecha(fecha) {
    if (!fecha) return "Sin fecha";

    const [dia, mes, anio] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
  }

  function convertirFechaInput(fecha) {
    if (!fecha) return "";

    const [dia, mes, anio] = fecha.split("-");
    return `${anio}-${mes}-${dia}`;
  }

  if (alumnoSeleccionado) {
    return (
      <Observaciones
        alumnoId={alumnoSeleccionado.id}
        maestraId={maestraId}
        aula={aula}
        alumno={alumnoSeleccionado}
        onVolverAula={() => setAlumnoSeleccionado(null)}
        onVolverAulas={onVolver}
      />
    );
  }

  return (
    <div className="alumnos-container">
      {/* 3. CONTENIDO PRINCIPAL */}
      <div className="contenido-principal">
        <div className='sala-actual'>
          <button className='boton-volver' onClick={onVolver}>
            Mis aulas / 
          </button>
          <p>{aula.nombre}</p>
        </div>
        <div className="header-titulo">
          <div>
            <p className="titulo-sala">{aula.nombre}</p>
            <p className='data-alumnos'>{alumnos.length} alumnos</p>
          </div>
          <button
            type="button"
            className="boton-nuevo-alumno"
            onClick={abrirPanelCrear}
          >
            + Agregar alumno
          </button>
        </div>

        {/* LISTADO DESKTOP */}
        <div className="lista-alumnos desktop-alumnos">

          <div className="alumno-grid alumno-header">
            <span>Alumno</span>
            <span>Nacimiento</span>
            <span>Anotaciones</span>
            <span>Última</span>
            <span>Acciones</span>
          </div>

          {alumnos.map((alumno) => (
            <div className="alumno-grid alumno-item" key={alumno.id}>
              <button
                className="alumno-nombre"
                type="button"
                onClick={() => setAlumnoSeleccionado(alumno)}
              >
                {alumno.nombre} {alumno.apellido}
              </button>

              <span>{formatearFecha(alumno.fechaNacimiento) || '-'}</span>
              <span>{alumno.cantidadAnotaciones ?? 0}</span>
              <span>{alumno.ultimaAnotacion || '-'}</span>

              <div className="alumno-acciones">
                <button
                  className="accion-editar"
                  onClick={() => abrirPanelEditar(alumno)}
                >
                  Editar
                </button>
                <p>·</p>
                <button
                  className="accion-eliminar"
                  onClick={() => eliminarAlumno(
                    alumno.id,
                    `${alumno.nombre} ${alumno.apellido}`
                  )}
                >
                  Eliminar
                </button>
              </div>

            </div>
          ))}
          {cargando && <p>Cargando alumnos...</p>}
          {error && <p>{error}</p>}
          {!cargando && alumnos.length === 0 && (
            <p className="lista-vacia">
              Todavía no hay alumnos en esta aula.
            </p>
          )}
        </div>


        {/* LISTADO MOBILE */}
        <div className="lista-alumnos-mobile">

          {alumnos.map((alumno) => (
            <button
              type="button"
              className="alumno-card-mobile"
              key={alumno.id}
              onClick={() => setAlumnoSeleccionado(alumno)}
            >
              <span className="mobile-alumno-nombre">
                {alumno.nombre} {alumno.apellido}
              </span>

              <span className="mobile-alumno-datos">
                {formatearFecha(alumno.fechaNacimiento) || '-'}
                <span> · </span>
                {alumno.cantidadAnotaciones ?? 0} anotaciones
              </span>
            </button>
          ))}
          {cargando && <p>Cargando alumnos...</p>}
          {error && <p>{error}</p>}
          {!cargando && alumnos.length === 0 && (
            <p className="lista-vacia">
              Todavía no hay alumnos en esta aula.
            </p>
          )}

        </div>
      </div>

      {/* PANEL LATERAL / BOTTOM SHEET (Crear o Editar Alumno) */}
      {mostrarPanel && (
        <div className="panel-lateral-custom">

          {/* Tirador visual para mobile */}
          <div className="panel-tirador-container">
            <div className="panel-tirador"></div>
          </div>

          {/* ENCABEZADO */}
          <div className="panel-encabezado">
            <p>{idEditando ? "Editar alumno" : "Agregar alumno"}</p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={guardarAlumno} className="form-alumno">

            <div className="campo-alumno">
              <label className="title-ingreso" htmlFor="nombre">Nombre <span className="input-required">*</span></label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Sofía"
                required
              />
            </div>

            <div className="campo-alumno">
              <label className="title-ingreso" htmlFor="apellido">Apellido <span className="input-required">*</span></label>
              <input
                id="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ej. Martínez"
                required
              />
            </div>

            <div className="campo-alumno">
              <label className="title-ingreso" htmlFor="fechaNacimiento">Fecha de nacimiento <span className="input-required">*</span></label>
              <input
                id="fechaNacimiento"
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
              />
            </div>

            {/* BOTONES */}
            <div className="panel-botones">
              <button type="submit" className="boton-guardar-alumno">Guardar</button>
              <button
                type="button"
                className="boton-cancelar-alumno"
                onClick={() => setMostrarPanel(false)}
                >
                Cancelar
              </button>
            </div>

            </form>
        </div>
      )}

    </div>
  );
}

export default Alumnos;