import { useState } from 'react';
import './Login.css';
import Logo from '../../components/Logo/Logo';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function iniciarSesion(event) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const respuesta = await fetch(
                'http://localhost:8080/kindernote/api/maestra/login',{ //endpoint de backend
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        contrasenia: password
                    })
                }
            );

            if (!respuesta.ok) {
                setError('Email o contraseña incorrectos.');
                return;
            }
            alert('Inicio de sesión exitoso');
            // Redirigir a aulas

        } catch (error) {
            setError('No se pudo conectar con el servidor. Intentá nuevamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login">
            <div className="header">
                <div className="header-container">
                    <Logo />
                    <div>
                        <h1 className="title">Tus observaciones del aula, listas para el informe.</h1>
                        <p className="subtitle">Anotá lo que ves en la sala y generá el borrador del informe de cada alumno.</p>
                    </div>
                    <p className='data'>UNSAM · Proyecto Integrador I · Grupo 7</p>
                </div>
            </div>

            <form onSubmit={iniciarSesion} className="form">
                <div className='form-container'>
                    <p className="form-title">Ingresá a tu cuenta</p>

                    <div className="input">
                        <p className="input-label">Email</p>
                        <input id="email" className="input-field" type="email" placeholder="example@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required/>
                    </div>

                    <div className="input">
                        <p className="input-label">Contraseña</p>
                        <input id="password" className="input-field" type="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} required/>
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>

                    <div className="register">
                        <p>¿No tenés cuenta? <a href="/register" className="register-link">Registrate</a></p>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;