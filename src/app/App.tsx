import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../Features/auth/Login';
import { Registro } from '../Features/auth/Registro';
import { HomeAdim } from '../Features/home/HomeAdim'; // Importe seu HomeAdmin corretamente
import { Home } from '../Features/home/Home'; // Importe seu Home corretamente
import { ResetPassword } from '../Features/auth/ResetPassword';
import './App.css'; // Mantenha se precisar de estilos globais
import { AuthProvider } from '../Shared/lib/firestore/AuthContext';
import '../my-app/app/globals.css'; 

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/home-admin" element={<HomeAdim />} />
        
        
        
        <Route path="/forgot-password" element={<ResetPassword />} />
       
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;