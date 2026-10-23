import React, { useState } from 'react';
import './Aulas.css';
import Nav from '../../components/Nav/Nav';

function Aulas() {
  const [aulas, setAulas] = useState([
    { id: 1, nombre: "Sala de 3 • Patitos", alumnos: 18, ultima: "hoy" },
    { id: 2, nombre: "Sala de 4 • Jirafas", alumnos: 22, ultima: "ayer" },
    { id: 3, nombre: "Sala de 5 • Delfines", alumnos: 20, ultima: "hace 3 días" }
  ]);

  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [nombreAula, setNombreAula] = useState("");
  const [idEditando, setIdEditando] = useState(null);

  const abrirPanelCrear = () => {
    setNombreAula("");
    setIdEditando(null);
    setMostrarPanel(true);
  };

  const abrirPanelEditar = (aula) => {
    setNombreAula(aula.nombre);
    setIdEditando(aula.id);
    setMostrarPanel(true);
  };

  const guardarAula = (e) => {
    e.preventDefault();
    if (!nombreAula.trim()) return;

    if (idEditando !== null) {
      setAulas(aulas.map(a => a.id === idEditando ? { ...a, nombre: nombreAula } : a));
    } else {
      const nueva = {
        id: Date.now(),
        nombre: nombreAula,
        alumnos: 0,
        ultima: "ninguna"
      };
      setAulas([...aulas, nueva]);
    }

    setMostrarPanel(false);
    setNombreAula("");
    setIdEditando(null);
  };

  const eliminarAula = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}"?`)) {
      setAulas(aulas.filter(a => a.id !== id));
    }
  };

  return (
    <div className="aulas-container" style={{ backgroundColor: '#eef1ee' }}>

      <div className="aulas-contenido">
        <div className="p-3 p-md-5 pb-5">

          <h2 className="fw-bold text-dark mb-3 fs-3 fs-md-2">Mis aulas</h2>

          <div className="d-grid d-sm-block mb-4">
            <button 
              onClick={abrirPanelCrear}
              className="btn text-white py-2 px-4 rounded-3 fw-semibold"
              style={{ backgroundColor: '#1b3b33' }}
            >
              + Nueva aula
            </button>
          </div>

          {/* LISTADO DE TARJETAS */}
          <div className="row g-3">
            {aulas.map((aula) => (
              <div className="col-12 col-md-6 col-lg-4" key={aula.id}>
                <div className="card border border-secondary border-opacity-25 shadow-sm rounded-4 p-3 bg-white">
                  <div className="card-body p-1">
                    <h5 className="card-title fw-bold text-dark mb-1">{aula.nombre}</h5>
                    <p className="card-text text-muted small mb-3">
                      {aula.alumnos} alumnos · última anotación {aula.ultima}
                    </p>
                    
                    <hr className="my-2 opacity-10" />

                    <div className="d-flex gap-3 pt-1">
                      <button className="btn btn-link p-0 text-success text-decoration-none fw-bold small">Abrir</button>
                      <button 
                        className="btn btn-link p-0 text-secondary text-decoration-none fw-bold small"
                        onClick={() => abrirPanelEditar(aula)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-link p-0 text-danger text-decoration-none fw-bold small"
                        onClick={() => eliminarAula(aula.id, aula.nombre)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-muted small mt-4 d-none d-md-block">
            Datos de ejemplo. Al eliminar un aula se pide confirmación en la misma pantalla.
          </p>

        </div>
      </div>

      <Nav />

      {/* 5. PANELES CONDICIONALES (SEPARADOS PARA EVITAR CONFLICTOS) */}
      {mostrarPanel && (
        <>
          {/* A. VERSIÓN MOBILE: Bottom Sheet (inferior) */}
          <div 
            className="position-fixed bottom-0 start-0 bg-white shadow-lg p-4 rounded-top-4 d-block d-md-none w-100" 
            style={{ maxHeight: '85vh', zIndex: 1060, overflowY: 'auto' }}
          >
            <div className="text-center mb-2">
              <div className="bg-secondary opacity-50 rounded-pill mx-auto" style={{ width: '40px', height: '4px' }}></div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-dark m-0">
                {idEditando ? "Editar aula" : "Nueva aula"}
              </h4>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setMostrarPanel(false)}
              ></button>
            </div>

            <form onSubmit={guardarAula}>
              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted">Nombre *</label>
                <input 
                  type="text" 
                  className="form-control rounded-3 py-2" 
                  value={nombreAula}
                  onChange={(e) => setNombreAula(e.target.value)}
                  placeholder="Ej. Sala de 4 • Jirafas"
                  required
                  autoFocus
                />
              </div>
              <p className="text-muted small">
                La historia sólo pide el nombre. El mismo panel sirve para editar.
              </p>

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

          {/* B. VERSIÓN PC: Panel Lateral Derecho Completo */}
          <div 
            className="position-fixed top-0 end-0 bottom-0 bg-white shadow-lg p-4 d-none d-md-flex flex-column justify-content-between" 
            style={{ width: '380px', zIndex: 1060, borderLeft: '1px solid #dee2e6' }}
          >
            <div>
              <p className="text-uppercase text-muted fw-bold small mb-1" style={{ fontSize: '0.75rem' }}>
                PANEL LATERAL
              </p>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-dark m-0">
                  {idEditando ? "Editar aula" : "Nueva aula"}
                </h4>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setMostrarPanel(false)}
                ></button>
              </div>

              <form id="form-aula-pc" onSubmit={guardarAula}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted">Nombre *</label>
                  <input 
                    type="text" 
                    className="form-control rounded-3 py-2" 
                    value={nombreAula}
                    onChange={(e) => setNombreAula(e.target.value)}
                    placeholder="Ej. Sala de 4 • Jirafas"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-muted small">
                  La historia sólo pide el nombre. El mismo panel sirve para editar.
                </p>
              </form>
            </div>

            <div className="d-flex gap-2 pt-3 border-top mt-3">
              <button 
                type="submit" 
                form="form-aula-pc"
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
          </div>
        </>
      )}

    </div>
  );
}

export default Aulas;