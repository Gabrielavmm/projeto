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
    <div className='Login-container'>
      <h1>DataBaker</h1>
      <h2>Dados do deu registro</h2>


      <form onSubmit={handleSubmit}>
        <fieldset>
        <label htmlFor="email">E-mail<input id="email" type="email" value={email} name="email" onChange={(e) => setEmail(e.target.value) }required/></label>
      </fieldset>
      <fieldset>
        <label htmlFor="password">Senha<input id="password" type="password" name="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}/></label>
      </fieldset>
      <button type="submit">Entrar</button>
      
      </form>
   
   
   <div>
      <Link to="/Register">Criar Conta</Link>
      <br/>
      <Link to="/forgot-password">Esqueci a senha</Link>
   </div>
   </div>
  );


}