import { useNavigate, useLocation } from 'react-router-dom';
import { House, Tag, FileText } from 'lucide-react';
import Logo from '../Logo/Logo';
import './Nav.css';

function Nav() {
    const navigate = useNavigate();
    const location = useLocation();

    const seleccionado = location.pathname;

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    function cerrarSesion() {
        localStorage.removeItem('usuario');
        navigate('/login');
    }

    function navegarA(ruta) {
        navigate(ruta);
    }

    return (
        <nav className="nav-container">
            <div className='nav-mobile'>
                <button
                    className={`navboton ${seleccionado === '/clases' ? 'activo' : ''}`}
                    onClick={() => navegarA('/clases')}
                ><House size={20}/>Aulas</button>

                <button 
                    className={`navboton ${seleccionado === '/etiquetas' ? 'activo' : ''}`}
                    onClick={() => navegarA('/etiquetas')}
                ><Tag size={20}/>Etiquetas</button>

                <button 
                    className={`navboton ${seleccionado === '/borradores' ? 'activo' : ''}`}
                    onClick={() => navegarA('/borradores')}
                ><FileText size={20}/>Informes</button>
            </div>
            
            <div className='nav-desktop'>
                <Logo />
                <div className='navegation-desktop'>
                    <button
                        className={`navboton ${seleccionado === '/clases' ? 'activo' : ''}`}
                        onClick={() => navegarA('/clases')}
                    >Mis aulas</button>

                    <button 
                        className={`navboton ${seleccionado === '/etiquetas' ? 'activo' : ''}`}
                        onClick={() => navegarA('/etiquetas')}
                    >Etiquetas</button>

                    <button 
                        className={`navboton ${seleccionado === '/borradores' ? 'activo' : ''}`}
                        onClick={() => navegarA('/borradores')}
                    >Informes</button>
                </div>

                <div className="nav-sesion">
                    <span>
                        {usuario ? `${usuario.nombre} ${usuario.apellido}` : ''}
                    </span>
                    
                    <button
                        type="button"
                        className="button-sesion"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Nav;