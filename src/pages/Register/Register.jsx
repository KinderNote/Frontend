import { useState } from 'react';
import { Circle, CheckCircle2, ChevronLeft} from 'lucide-react';
import './Register.css';
import Logo from '../../components/Logo/Logo';

function Register() {
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const requisitos = [
        {
            texto: 'Entre 8 y 32 caracteres',
            cumplido:
                password.length >= 8 &&
                password.length <= 32
        },
        {
            texto: 'Al menos 1 mayúscula',
            cumplido: /[A-Z]/.test(password)
        },
        {
            texto: 'Al menos 1 minúscula',
            cumplido: /[a-z]/.test(password)
        },
        {
            texto: '1 número o carácter especial',
            cumplido: /[0-9]|[^A-Za-z0-9\s]/.test(password)
        }
    ];
    const passwordValida = requisitos.every((requisito) => requisito.cumplido);

    async function handleRegister(event) {
            event.preventDefault();
            setError('');
        try {
            const response = await fetch(
                'http://localhost:3000/api/auth/register', { //endpoint de backend
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, lastname, email, password })
                }
            );

            if (!response.ok) {
                throw new Error('Error al registrar el usuario');
            }
            // Redirigir a aulas
        } catch (error) {
            setError('Error al registrar el usuario');
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
                <button className="volver-button" ><a className="volver-button" href="/login"><ChevronLeft/>Volver</a></button>
                <p className="register-title">Registrate</p>
                <form className="register-form" onSubmit={handleRegister}>
                    <div className="nombre-apellido">
                        <div className="input">
                            <div className="input-label">
                                <p>Nombre</p>
                                <p className="input-required">*</p>
                            </div>
                            <input className="input-field" type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required/>
                        </div>
                        <div className="input">
                            <div className="input-label">
                                <p>Apellido</p>
                                <p className="input-required">*</p>
                            </div>
                            <input className="input-field" type="text" placeholder="Apellido" value={lastname} onChange={(e) => setLastname(e.target.value)} required/>
                        </div>
                    </div>

                    <div className="input">
                        <div className="input-label">
                            <p>Email</p>
                            <p className="input-required">*</p>
                        </div>
                        <input className="input-field" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="input">
                        <div className="input-label">
                            <p>Contraseña</p>
                            <p className="input-required">*</p>
                        </div>
                        <input className="input-field" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required/>
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

                    <button className="register-button" type="submit" disabled={!passwordValida}>Crear cuenta</button>
                </form>

                <div className="login">
                        <p>¿Ya tenés cuenta? <a href="/login" className="login-link">Inicia sesión</a></p>
                    </div>
            </div>
        </div>
    );
}
export default Register;