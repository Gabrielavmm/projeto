import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../../Shared/lib/firestore/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function Registro(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await register(email, password);
        toast.success('Usuário criado com sucesso');
        navigate('/login');
    }
          

     return(
        <div>
            <h1>Databake</h1>
            <h2>Insira seus dados</h2>

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor="name">Nome<input id="name" type="text" value={name} name="name" onChange={(e) => setName(e.target.value) }required/></label>
                </fieldset>
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
      <div class-name="link-auth">
        <Link to="/login">Já tenho conta</Link>
        
        </div>
        </div>
        );
} 