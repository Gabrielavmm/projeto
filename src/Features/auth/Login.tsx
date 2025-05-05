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
    try {
      await login(email, password);
      navigate('/dashbord');
    } catch (error) {
      const firebaseError = error as FirebaseError; 
      toast.error(firebaseError.message); 
      
      if (firebaseError.code === 'auth/wrong-password') {
        toast.error('Senha incorreta');
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 " style={{ display: 'block', marginBottom: '7px',marginTop:' 17px', fontSize: '16px', width: '84%' }}>
          Email:   </label>
        <input
          value={email}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full  p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '18%'}}
          placeholder=" Ex: seu@email.com"
          required
        />
      </div>
      
     
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 " style={{ display: 'block', marginBottom: '7px',marginTop:'17px', fontSize: '16px', width: '84%' }}>
          Senha:
        </label>
        <input
          value={password}
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '18%'}}
          placeholder=" ********"
          required
        />
        </div>
      
        <button
          type='submit'
          onClick={handleSubmit}
          style={{marginTop: '22px', height: '35px', width:'19%', backgroundColor: '#22C55E', color: 'white', borderRadius: '5px',border: 'none', fontSize: '12px', fontWeight: 'semi-bold'}}
         >ENTRAR</button>
          <fieldset style ={{marginTop:'442px',  padding: '1.5px', backgroundColor: '#E2E8F0', border: 'none' }}></fieldset>

      </form>
   
   
   
   <div style={{marginTop: '12px', fontSize: '18px'}}>
    <span className="text-gray-600">Não tem conta? </span>
      <Link to="/Register" className='text-custom-green'>Registrar</Link>
      <br/>
      <Link to="/forgot-password"  style={{color:'#717171'}}>Esqueci a senha</Link>
   </div>
   </div>
  );


}