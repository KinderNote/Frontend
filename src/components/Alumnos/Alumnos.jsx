import React, { useState } from 'react';
import './Alumnos.css';

function Alumnos() {
  // Estado simulado de alumnos (preparado para conectar con tu alumnosService del backend)
  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: "Sofía", apellido: "Martínez", dni: "45123456", sala: "Sala de 3 • Patitos" },
    { id: 2, nombre: "Lucas", apellido: "Gómez", dni: "45987654", sala: "Sala de 4 • Jirafas" },
    { id: 3, nombre: "Catalina", apellido: "Rodríguez", dni: "46111222", sala: "Sala de 5 • Delfines" }
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
    <div className="alumnos-container" style={{ backgroundColor: '#eef1ee' }}>
      <div className="row g-0 flex-grow-1">

        {/* 3. CONTENIDO PRINCIPAL */}
        <div className="col-12 col-md-9 col-lg-10 p-3 p-md-5 pb-5">
          
          <h2 className="fw-bold text-dark mb-3 fs-3 fs-md-2">Gestión de alumnos</h2>

          {/* Botón "+ Nuevo alumno" adaptable a mobile */}
          <div className="d-grid d-sm-block mb-4">
            <button 
              onClick={abrirPanelCrear}
              className="btn text-white py-2 px-4 rounded-3 fw-semibold shadow-sm"
              style={{ backgroundColor: '#1b3b33' }}
            >
              + Nuevo alumno
            </button>
          </div>

          {/* LISTADO DE TARJETAS DE ALUMNOS */}
          <div className="row g-3">
            {alumnos.map((alumno) => (
              <div className="col-12 col-md-6 col-lg-4" key={alumno.id}>
                <div className="card border border-secondary border-opacity-25 shadow-sm rounded-4 p-3 bg-white">
                  <div className="card-body p-1">
                    <h5 className="card-title fw-bold text-dark mb-1">
                      {alumno.nombre} {alumno.apellido}
                    </h5>
                    <p className="card-text text-muted small mb-1">
                      DNI: {alumno.dni}
                    </p>
                    <p className="card-text text-muted small mb-3">
                      {alumno.sala}
                    </p>
                    
                    <hr className="my-2 opacity-10" />

                    <div className="d-flex gap-3 pt-1">
                      <button 
                        className="btn btn-link p-0 text-secondary text-decoration-none fw-bold small"
                        onClick={() => abrirPanelEditar(alumno)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-link p-0 text-danger text-decoration-none fw-bold small"
                        onClick={() => eliminarAlumno(alumno.id, `${alumno.nombre} ${alumno.apellido}`)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

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