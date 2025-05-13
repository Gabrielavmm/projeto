import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { login } from '../../Shared/lib/firestore/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
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
      await login(email, password);
      
      navigate('/admin');
    } catch (error) {
      toast.dismiss();
      const firebaseError = error as FirebaseError; 
      
      const errorMessage = firebaseError.message.toLowerCase();
      if (errorMessage.includes('invalid-credential')) {
      toast.error('usuario e/ou senha inválidos');
    } else {
      toast.error('Erro ao fazer login: ' + firebaseError.message);
    }
      
    }
  };





  return (
    <div className=" flex flex-col justify-center px-4 bg-custom-bg" style={{textAlign:'center', minHeight: '100vh'}}>
    <h1 className=' font-sans' style={{fontSize:'60px', lineHeight: '110px', marginBottom: '15px'}}>
        <span className="text-custom-dark" style={{fontWeight:'30'}} >Data</span>
        <span className="text-custom-green" >Baker</span>
    </h1>

      <form onSubmit={handleSubmit}>
       
        <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 " style={{ display: 'block', marginBottom: '7px',marginTop:' 17px', fontSize: '16px', width: '30%' }}>
          Email  </label>
        <input
          value={email}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full  p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '78%'}}
          placeholder=" Ex: seu@email.com"
          
        />
       
          

      </div>

      
     
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 " style={{ display: 'block', marginBottom: '7px',marginTop:'17px', fontSize: '16px', width: '30%' }}>
          Senha:
        </label>
        <input
          value={password}
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '78%'}}
          placeholder=" ********"
          
        />
        </div>
      
        <button
          type='submit'
          
          style={{marginTop: '22px', height: '35px', width:'78%', backgroundColor: '#22C55E', color: 'white', borderRadius: '5px',border: 'none', fontSize: '12px', fontWeight: 'semi-bold'}}
         >ENTRAR</button>
          <fieldset style ={{marginTop:'370px',  padding: '1.5px', backgroundColor: '#E2E8F0', border: 'none' }}></fieldset>

      </form>
   
    
   
   <div style={{marginTop: '10px', fontSize: '15px'}}>
    <span className="text-gray-600">Não tem conta? </span>
      <Link to="/register" className='text-custom-green'>Registrar</Link>
      <br/>
      <Link to="/forgot-password"  style={{color:'#717171'}}>Esqueci a senha</Link>
   </div>
   </div>
  );


}