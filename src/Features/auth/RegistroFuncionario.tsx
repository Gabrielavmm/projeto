import { Link, useNavigate } from "react-router-dom";
import { register } from "../../Shared/lib/firestore/auth";
import { useState } from "react";
import toast from "react-hot-toast";



export function RegistroFuncionario() {
    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      setLoading(true);
      toast.dismiss();
      try{   
      await register(email, password, { 
        name, 
        cnpj: cnpj 
      }, "funcionario");
      toast.success('Usuário criado com sucesso');
      navigate('/funcionario');
    } catch (error) {
      if ((error as Error).message.includes("CNPJ não cadastrado")) {
        toast.error("CNPJ não cadastrado como empresa");
      } else {
        toast.error("Erro ao criar usuário: " + (error as Error).message);
      }
      console.error(error);
    }
    

    }
    
    return(
        <div className=" flex flex-col justify-center px-4 bg-custom-bg" style={{textAlign:'center', minHeight: '100vh'}}>
        <h1 className=' font-sans' style={{fontSize:'60px', lineHeight: '110px', marginBottom: '15px'}}>
            <span className="text-custom-dark" style={{fontWeight:'30'}} >Data</span>
            <span className="text-custom-green" >Baker</span>
        </h1>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
        <div style={{ 
      width: '100%', 
      maxWidth: '800px',  
      margin: '0 auto',
      padding: window.innerWidth < 768 ? '0 20px' : '0'  , boxSizing: 'border-box' 
}}>
        
        {/* Nome */}
        <div className="relative">
        
        <label htmlFor="nome" 
        className="font-medium bg-custom-dark md:w-[23%]"
        style={{ 
          display: 'block', 
          marginBottom: '7px', 
          fontSize: '13px', 
          width: '100%',
          textAlign: 'left'
        }}>
          Nome completo:   </label>
          
        <input
          value ={name} 
          
          id="nome"
          type="text"
          onChange={(e) => setName(e.target.value)}
          className=" w-full p-4 text-base bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500" 
          style={{height: '30px', width: '100%', marginBottom:'7px', outline: 'none', }}
          placeholder=" Ex: João da Silva "
          required
        />
        <div>

        {/* CNPJ */}
        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 " 
        style={{ 
          display: 'block', 
          marginBottom: '7px', 
          fontSize: '13px', 
          width: '100%',
          textAlign: 'left'
        }}>
          CNPJ da empresa vinculada:</label>
        <input
            value={cnpj}
            id="cnpj"
            type="text"
            onChange={(e) => setCnpj(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            style={{height: '30px', width: '100%', marginBottom:'7px', outline: 'none', }}
            placeholder=" Ex: 12.345.678/0001-90"
            required
        />
       
        </div>

        {/* Email */}
        <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 " 
        style={{ 
          display: 'block', 
          marginBottom: '7px', 
          fontSize: '13px', 
          width: '100%',
          textAlign: 'left'
        }}>
          Email:   </label>
        <input
          value={email}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full  p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          style={{height: '30px', width: '100%', marginBottom:'7px', outline: 'none', }}
          placeholder=" Ex: seu@email.com"
          required
        />
      </div>
        {/* Senha */}
        <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 " 
        style={{ 
          display: 'block', 
          marginBottom: '7px', 
          fontSize: '13px', 
          width: '100%',
          textAlign: 'left'
        }}>
          Senha:
        </label>
        <input
          value={password}
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          style={{height: '30px', width: '100%', marginBottom:'7px', outline: 'none', }}
          placeholder=" ********"
          required
        />
        </div>
        {/* Botão de Registro */}
        <button
          type='submit'
          onClick={handleSubmit}
          style={{marginTop: '22px', height: '30px', width:'100%', backgroundColor: '#22C55E', color: 'white', borderRadius: '5px',border: 'none', fontSize: '12px', fontWeight: 'semi-bold'}}
         >CADASTRAR</button>
         </div>

        </div>
        
        </form>
        <fieldset style={{
        marginTop: window.innerWidth < 768 ? '150px' : '260px',
        padding: '0',
        backgroundColor: '#E2E8F0',
        border: 'none',
        height: '1px'
      }}></fieldset>

      <div style={{
        marginTop: '12px',
        marginBottom: window.innerWidth < 768 ? '20px' : '30px', // Espaço extra na base
        fontSize: window.innerWidth < 768 ? '14px' : '16px',
        textAlign: 'center'
      }}>
        <span className="text-gray-600">Já tem conta? </span>
        <Link to="/login" className='text-custom-green'>
        Entrar
        </Link>
        </div>
        </div>
       
        
    )

    
 

}
