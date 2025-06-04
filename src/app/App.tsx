import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from '../Features/auth/Login';
import { Registro } from '../Features/auth/Registro';
import { RegistroEmpresa } from '../Features/auth/RegistroEmpresa';
import { RegistroFuncionario } from '../Features/auth/RegistroFuncionario';
import { Grafico } from '../Features/Funcionarios/Grafico';
import { PaginadeEspera } from '../Features/home/PaginadeEspera';

import { Navigate } from 'react-router-dom';
import { HomeAdmin } from '../Features/adimin/HomeAdmin';
import { HomeEmpresa } from '../Features/Empresa/HomeEmpresa';
import { Indicadores } from '../Features/adimin/Indicadores';
import { ControleFuncionarios } from '../Features/adimin/ControleFuncionarios';
import { EditarPerfil } from '../Features/adimin/EditarPerfil';
import { EditarperfilFuncionario } from '../Features/Funcionarios/EditarPerfilFuncionario';
import { EditarperfilEmpresa } from '../Features/Empresa/EditarperfilEmpresa';
import { ControleFuncionariosEmpresa } from '../Features/Empresa/ControlefuncionariosEmpresa';
import { Opcao } from '../Features/home/OpcaoRegistro';
import { ResetPassword } from '../Features/auth/ResetPassword';
import { HomeFuncionario } from '../Features/Funcionarios/HomeFuncionario';
import './App.css'; // Mantenha se precisar de estilos globais
import { AuthProvider } from '../Shared/lib/firestore/AuthContext';
import '../my-app/app/globals.css'; 

function App() {
  return (
   
    <AuthProvider>
    <BrowserRouter>
    <Toaster /> 
     
      

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/opcao" element={<Opcao />} />
        <Route path="/registro-empresa" element={<RegistroEmpresa />} />
        <Route path="/registro-funcionario" element={<RegistroFuncionario />} />
        <Route path="/paginadeespera" element={<PaginadeEspera />} />
        
        <Route path="/register" element={<Registro />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="/empresa" element={<HomeEmpresa />} />
        <Route path="/funcionario" element={<HomeFuncionario />} />
        <Route path="indicadores" element={<Indicadores />} />
        <Route path="grafico" element={<Grafico />} />
        <Route path="controle-funcionarios" element={<ControleFuncionarios />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/editar-perfil-funcionario" element={<EditarperfilFuncionario />} />
        <Route path="/editar-perfil-empresa" element={<EditarperfilEmpresa />} />
        <Route path="/controle-funcionarios-empresa" element={<ControleFuncionariosEmpresa />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    
  );
}

export default App;