import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../Features/auth/Login';
import { Registro } from '../Features/auth/Registro';
import { Navigate } from 'react-router-dom';
import { HomeAdmin } from '../Features/adimin/HomeAdmin';
import { Indicadores } from '../Features/adimin/Indicadores';
import { ControleFuncionarios } from '../Features/adimin/ControleFuncionarios';
import { EditarPerfil } from '../Features/adimin/EditarPerfil';

import { ResetPassword } from '../Features/auth/ResetPassword';
import './App.css'; // Mantenha se precisar de estilos globais
import { AuthProvider } from '../Shared/lib/firestore/AuthContext';
import '../my-app/app/globals.css'; 

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
     
      

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="indicadores" element={<Indicadores />} />
        <Route path="controle-funcionarios" element={<ControleFuncionarios />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;