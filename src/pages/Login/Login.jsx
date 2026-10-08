import './Login.css';
import Logo from '../../components/Logo/Logo';

function Login() {
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
            <div className="form">
                <div className='form-container'>
                    <p className="form-title">Ingresá a tu cuenta</p>
                    <div className="input">
                        <p className="input-label">Email</p>
                        <input className="input-field" type="text" placeholder="example@email.com"/>
                    </div>
                    <div className="input">
                        <p className="input-label">Contraseña</p>
                        <input className="input-field" type="password" placeholder="Contraseña" />
                    </div>
                    <button className="login-button">Ingresar</button>
                    <div className="register">
                        <p>¿No tenés cuenta? <a href="/register" className="register-link">Registrate</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;