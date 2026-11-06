import './App.css';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Aulas from './pages/Aulas/Aulas.jsx';
import Etiquetas from './pages/Etiquetas/Etiquetas.jsx';
import Borrador from './pages/Borrador/Borrador.jsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clases" element={<Aulas />} />
        <Route path="/etiquetas" element={<Etiquetas />} />  
        <Route path="/borradores" element={<Borrador />} /> 
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;