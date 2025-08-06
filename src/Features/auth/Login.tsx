import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { handleFirebaseError, loginUser } from '../../Shared/lib/firestore/indicadores/auhtservice';
import { FirebaseError } from 'firebase/app';


export function Login() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();

    if (!email) {
      toast.error('insira o email');
      return;
    }
    if (!password) {
      toast.error('insira a senha');
      return;
    }
    
    try {
      const { userData } = await loginUser(email, password);
      
      switch(userData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'empresa':
          navigate('/empresa');
          break;
        case 'funcionario':
          navigate('/funcionario');
          break;
        default:
          navigate('/');
      }
      
    } catch (error) {
      toast.dismiss();
      const errorMessage = error instanceof FirebaseError 
        ? handleFirebaseError(error)
        : 'Erro desconhecido ao fazer login';
      toast.error(errorMessage);
    }
  };





  return (
    <div className=" flex flex-col justify-center px-4 bg-custom-bg" style={{textAlign:'center', minHeight: '100vh'}}>
    <h1 className=' font-sans' style={{fontSize:'60px', lineHeight: '110px'}}>
        <span className="text-custom-dark" style={{fontWeight:'30'}} >Data</span>
        <span className="text-custom-green" >Baker</span>
    </h1>

      <form onSubmit={handleSubmit}>
      <div style={{ 
      width: '100%', 
      maxWidth: '800px',  
      margin: '0 auto',
      padding: window.innerWidth < 768 ? '0 20px' : '0'  , boxSizing: 'border-box' 
}}>
       
        <div>
        <label htmlFor="email" 
        className="block text-sm font-medium text-gray-700 md:w-[26%]"
        style={{ 
          display: 'block', 
          marginBottom: '7px', 
          fontSize: '13px', 
          width: '100%',
          textAlign: 'left'
        }}>
          Email  </label>
        <input
          value={email}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full  p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{height: '30px', width: '100%', marginBottom:'7px', outline: 'none', }}
          placeholder=" Ex: seu@email.com"
          
        />
       
          

      </div>

      
     
      <div>
        <label htmlFor="password" 
        className="block text-sm font-medium text-gray-700 md:w-[25%]"
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
          
        />
        </div>
      
        <button
          type='submit'
          
          style={{marginTop: '22px', height: '30px', width:'100%', backgroundColor: '#22C55E', color: 'white', borderRadius: '5px',border: 'none', fontSize: '12px', fontWeight: 'semi-bold'}}
         >ENTRAR</button>
          </div>

      </form>
      <fieldset style={{
        marginTop: window.innerWidth < 768 ? '220px' : '360px',
        padding: '0',
        backgroundColor: '#E2E8F0',
        border: 'none',
        height: '1px'
      }}></fieldset>
   
    
   
      <div style={{
        marginTop: '12px',
        marginBottom: window.innerWidth < 768 ? '20px' : '30px', 
        fontSize: window.innerWidth < 768 ? '14px' : '16px',
        textAlign: 'center'
      }}>
    <span className="text-gray-600">Não tem conta? </span>
      <Link to="/opcao" className='text-custom-green'>Registrar</Link>
      <br/>
      <Link to="/forgot-password"  style={{color:'#717171'}}>Esqueci a senha</Link>
   </div>
   </div>
  );


}