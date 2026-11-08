import React, { useState } from 'react';
import './Alumnos.css';

function Alumnos({ aula, onVolver }) {
  // Estado simulado de alumnos (preparado para conectar con tu alumnosService del backend)
  const [alumnos, setAlumnos] = useState([
    {id: 1,nombre: "Sofía",apellido: "Martínez",dni: "45123456",fechaNacimiento: "12/04/2022",cantidadAnotaciones: 8,ultimaAnotacion: "05/11/2026"},
    {id: 2,nombre: "Mateo",apellido: "González",dni: "45123457",fechaNacimiento: "15/06/2021",cantidadAnotaciones: 5,ultimaAnotacion: "20/10/2026"},
    {id: 3,nombre: "Valentina",apellido: "Rodríguez",dni: "45123458",fechaNacimiento: "22/09/2020",cantidadAnotaciones: 12,ultimaAnotacion: "10/09/2026"},
    {id: 4,nombre: "Benjamínadsasdasdasdasda",apellido: "López",dni: "45123459",fechaNacimiento: "30/11/2019",cantidadAnotaciones: 3,ultimaAnotacion: "15/08/2026"},
    {id: 5,nombre: "Isabella",apellido: "Pérez",dni: "45123460",fechaNacimiento: "05/02/2018",cantidadAnotaciones: 7,ultimaAnotacion: "25/07/2026"},
    {id: 6,nombre: "Santiago",apellido: "Gómez",dni: "45123461",fechaNacimiento: "18/03/2017",cantidadAnotaciones: 10,ultimaAnotacion: "30/06/2026"},
  ]);

  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [idEditando, setIdEditando] = useState(null);

  const abrirPanelCrear = () => {
    setNombre("");
    setApellido("");
    setDni("");
    setIdEditando(null);
    setMostrarPanel(true);
  };

  const abrirPanelEditar = (alumno) => {
    setNombre(alumno.nombre);
    setApellido(alumno.apellido);
    setDni(alumno.dni);
    setIdEditando(alumno.id);
    setMostrarPanel(true);
  };

  const guardarAlumno = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim()) return;

    if (idEditando !== null) {
      // Lógica de edición
      setAlumnos(alumnos.map(a => a.id === idEditando ? { ...a, nombre, apellido, dni } : a));
    } else {
      // Lógica de creación
      const nuevoAlumno = {
        id: Date.now(),
        nombre,
        apellido,
        dni: dni || "Sin DNI",
        sala: "Sala asignada"
      };
      setAlumnos([...alumnos, nuevoAlumno]);
    }

    setMostrarPanel(false);
    setNombre("");
    setApellido("");
    setDni("");
    setIdEditando(null);
  };

  const eliminarAlumno = (id, nombreCompleto) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a "${nombreCompleto}"?`)) {
      setAlumnos(alumnos.filter(a => a.id !== id));
    }
  };

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

                    <span>{alumno.fechaNacimiento || '-'}</span>
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
                {alumno.fechaNacimiento || '-'}
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
      {/* 5. PANEL LATERAL / BOTTOM SHEET (Crear o Editar Alumno) */}
      {mostrarPanel && (
        <div className="bg-white shadow-lg p-4 rounded-top-4 rounded-md-0 panel-lateral-custom">
          {/* Tirador visual gris para mobile */}
          <div className="d-block d-md-none text-center mb-2">
            <div className="bg-secondary opacity-50 rounded-pill mx-auto" style={{ width: '40px', height: '4px' }}></div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-dark m-0">
              {idEditando ? "Editar alumno" : "Nuevo alumno"}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setMostrarPanel(false)}
            ></button>
          </div>

          <form onSubmit={guardarAlumno}>
            <div className="mb-3">
              <label className="form-label fw-semibold small text-muted">Nombre *</label>
              <input 
                type="text" 
                className="form-control rounded-3 py-2" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Sofía"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small text-muted">Apellido *</label>
              <input 
                type="text" 
                className="form-control rounded-3 py-2" 
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ej. Martínez"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small text-muted">DNI</label>
              <input 
                type="text" 
                className="form-control rounded-3 py-2" 
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ej. 45123456"
              />
            </div>

            <div className="d-flex gap-2 mt-4">
              <button 
                type="submit" 
                className="btn text-white w-50 fw-semibold py-2 rounded-3" 
                style={{ backgroundColor: '#1b3b33' }}
              >
                Guardar
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary w-50 fw-semibold py-2 rounded-3"
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