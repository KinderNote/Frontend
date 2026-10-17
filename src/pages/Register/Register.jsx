import { useState } from 'react';
import { Circle, CheckCircle2, ChevronLeft} from 'lucide-react';
import { registrarUsuario } from '../../services/authService';
import './Register.css';
import Logo from '../../components/Logo/Logo';

function Register() {
    const [error, setError] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [registrando, setRegistrando] = useState(false);
    const [registrado, setRegistrado] = useState(false);
    const requisitos = [
        {
            texto: 'Entre 8 y 32 caracteres',
            cumplido:
                contrasenia.length >= 8 &&
                contrasenia.length <= 32
        },
        {
            texto: 'Al menos 1 mayúscula',
            cumplido: /[A-Z]/.test(contrasenia)
        },
        {
            texto: 'Al menos 1 minúscula',
            cumplido: /[a-z]/.test(contrasenia)
        },
        {
            texto: '1 número o carácter especial',
            cumplido: /[0-9]|[^A-Za-z0-9\s]/.test(contrasenia)
        }
    ];
    const passwordValida = requisitos.every((requisito) => requisito.cumplido);
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    async function handleRegister(event) {
        event.preventDefault();
        setError('');
        setRegistrado(false);

        if (!passwordValida) {
            setError('La contraseña no cumple los requisitos.');
            return;
        }

        try {
            setRegistrando(true);
            await registrarUsuario({
                nombre,
                apellido,
                email,
                contrasenia
            });
            setRegistrado(true);
        } catch (error) {
            setError(error.message || 'Error al registrar el usuario.');
        } finally {
            setRegistrando(false);
        }
    }

    return (
        <div className="register">
            <div className="header">
                <div className="header-container">
                    <Logo />
                    <h1 className="title">Creá tu cuenta de docente.</h1>
                    <p className='data'>UNSAM · Proyecto Integrador I · Grupo 7</p>
                </div>
            </div>
            <div className="register-container">
                <button className="volver-button" ><a className="volver-button" href="#/login"><ChevronLeft/>Volver</a></button>
                <p className="register-title">Registrate</p>
                <form className="register-form" onSubmit={handleRegister}>
                    <div className="nombre-apellido">
                        <div className="input">
                            <div className="input-label">
                                <p>Nombre</p>
                                <p className="input-required">*</p>
                            </div>
                            <input className="input-field" type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
                        </div>
                        <div className="input">
                            <div className="input-label">
                                <p>Apellido</p>
                                <p className="input-required">*</p>
                            </div>
                            <input className="input-field" type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required/>
                        </div>
                    </div>

                    <div className="input">
                        <div className="input-label">
                            <p>Email</p>
                            <p className="input-required">*</p>
                        </div>
                        <input className="input-field" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" required/>
                    </div>
                    <div className="input">
                        <div className="input-label">
                            <p>Contraseña</p>
                            <p className="input-required">*</p>
                        </div>
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Contraseña"
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                            minLength={8}
                            maxLength={32}
                            required
                        />
                    </div>
                        
                    <div className="validation-password">
                        {requisitos.map((requisito, index) => (
                            <div key={index} className={"validation-item"}>
                                {requisito.cumplido ? (
                                    <CheckCircle2 size={13}/>
                                ) : (
                                    <Circle size={13}/>
                                )}
                                <p>{requisito.texto}</p>
                            </div>
                        ))}
                    </div>
                    {error && (
                        <p className="register-error" role="alert">
                            {error}
                        </p>
                    )}

                    {registrado && (
                        <p role="status">
                            ¡Registro exitoso!
                        </p>
                    )}

                    <button
                        className="register-button"
                        type="submit"
                        disabled={!passwordValida || registrando || !emailValido}
                    >
                        {registrando ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <div className="login">
                        <p>¿Ya tenés cuenta? <a href="#/login" className="login-link">Inicia sesión</a></p>
                    </div>
            </div>
        </div>
    );
}
export default Register;