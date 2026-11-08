import React, { useState } from 'react';
import './Alumnos.css';

function Alumnos({ aula, onVolver }) {
  const [alumnos, setAlumnos] = useState([
    {id: 1,nombre: "Sofía",apellido: "Martínez",fechaNacimiento: "2022-04-12",cantidadAnotaciones: 8,ultimaAnotacion: "05/11/2026"},
    {id: 2,nombre: "Mateo",apellido: "González",fechaNacimiento: "2021-06-15",cantidadAnotaciones: 5,ultimaAnotacion: "20/10/2026"},
    {id: 3,nombre: "Valentina",apellido: "Rodríguez",fechaNacimiento: "2020-09-22",cantidadAnotaciones: 12,ultimaAnotacion: "10/09/2026"}
  ]);

  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [idEditando, setIdEditando] = useState(null);

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
    setFechaNacimiento(alumno.fechaNacimiento || "");
    setIdEditando(alumno.id);
    setMostrarPanel(true);
  };

  const guardarAlumno = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim()) return;

    if (idEditando !== null) {
      // Edición
      setAlumnos(alumnos.map(a =>
        a.id === idEditando
          ? { ...a, nombre, apellido, fechaNacimiento }
          : a
      ));
    } else {
      // Creación
      const nuevoAlumno = {
        id: Date.now(),
        nombre,
        apellido,
        fechaNacimiento,
        sala: "Sala asignada"
      };

      setAlumnos([...alumnos, nuevoAlumno]);
    }

    setMostrarPanel(false);
    setNombre("");
    setApellido("");
    setFechaNacimiento("");
    setIdEditando(null);
  };

  const eliminarAlumno = (id, nombreCompleto) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a "${nombreCompleto}"?`)) {
      setAlumnos(alumnos.filter(a => a.id !== id));
    }
  };

  function formatearFecha(fecha) {
    if (!fecha) return "Sin fecha";

    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
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

                    <button className="alumno-nombre" type="button">
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

            {alumnos.length === 0 && (
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
              onClick={() => abrirPanelEditar(alumno)}
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

          {alumnos.length === 0 && (
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