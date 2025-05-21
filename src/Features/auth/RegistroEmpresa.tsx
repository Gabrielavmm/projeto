import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../Shared/lib/firestore/auth";
import toast from "react-hot-toast";

export function RegistroEmpresa() {
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    try {
      await register(email, password, { name, cnpj }, "empresa");
      toast.success('Usuário criado com sucesso');
      navigate('/empresa');
    } catch (error) {
      console.error('Erro ao registrar empresa:', error);
    }
  }







  return(
  <div className=" flex flex-col justify-center px-4 bg-custom-bg" style={{textAlign:'center', minHeight: '100vh'}}>
      <h1 className=' font-sans' style={{fontSize:'60px', lineHeight: '110px', marginBottom: '15px'}}>
          <span className="text-custom-dark" style={{fontWeight:'30'}} >Data</span>
          <span className="text-custom-green" >Baker</span>
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit}>

      {/* Nome */}
      <div className="relative">
        <label htmlFor="nome" className="font-medium bg-custom-dark" style={{ display: 'block', marginBottom: '7px', fontSize: '13px', width: '41%' }}>
          Nome da empresa:
        </label>
        <input
          value={name}
          id="nome"
          type="text"
          onChange={(e) => setName(e.target.value)}
          className=" w-full p-4 text-base bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '81%', marginBottom:'7px'}}
          placeholder=" Ex: Baker CIA. "
          required
        />
        </div>

        {/* CNPJ */}
        <div className="relative">
          <label htmlFor="cnpj" className="font-medium bg-custom-dark" style={{ display: 'block', marginBottom: '7px', fontSize: '13px', width: '22%' }}>
            CNPJ:
          </label>
          <input
            value={cnpj}
            id="cnpj"
            type="text"
            onChange={(e) => setCnpj(e.target.value)}
            className=" w-full p-4 text-base bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '81%', marginBottom:'7px'}}
            placeholder=" Ex: 12.345.678/0001-90 "
            required
          />
        </div>
        {/* Endereço */}
        
        {/* Email */}
        <div >
        <label htmlFor="email" className="font-medium bg-custom-dark" style={{ display: 'block', marginBottom: '7px', fontSize: '13px', width: '24%' }}>
          Email: </label>
          <input
          value={email}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full  p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '81%', marginBottom:'7px'}}
          placeholder=" Ex: seu@email.com"
          required
        />

        </div>
        {/* Senha */}
        <div>
        <label htmlFor="password" className="font-medium bg-custom-dark" style={{ display: 'block', marginBottom: '7px', fontSize: '13px', width: '25%' }}>
          Senha:</label>
          
        <input
          value={password}
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '81%'}}
          placeholder=" ********"
          required
        />
        </div>

         {/* Botão de Registro */}
         <button
          type='submit'
          onClick={handleSubmit}
          style={{marginTop: '22px', height: '35px', width:'81%', backgroundColor: '#22C55E', color: 'white', borderRadius: '5px',border: 'none', fontSize: '12px', fontWeight: 'semi-bold'}}
         >CADASTRAR</button>

        <fieldset style ={{marginTop:'150px',  padding: '1.5px', backgroundColor: '#E2E8F0', border: 'none' }}></fieldset>



      </form>
      <div style={{marginTop: '12px', fontSize: '13px'}}>
        <span className="text-gray-600">Já tem conta? </span>
        <Link to="/login" className='text-custom-green'>
        Entrar
        </Link>
        </div>
      </div>
  )
}