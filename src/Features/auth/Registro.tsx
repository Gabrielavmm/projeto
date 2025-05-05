import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../../Shared/lib/firestore/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function Registro(){
    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await register(email, password);
        toast.success('Usuário criado com sucesso');
        navigate('/home-admin');

    }
    
    return(
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-custom-bg">
        <h1 className='text-4xl font-bold text-center mb-8 font-sans'>
            <span className="text-custom-dark">Data</span>
            <span className="text-custom-green">Baker</span>
        </h1>
        <div className="border border-red-500 p-2">
        <form className="space-y-6">
            {/* Nome */}
        <div>
        
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome completo:   </label>
        <input
          id="nome"
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: João da Silva"
        />
        <div>
        {/* CNPJ */}
        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
          CNPJ da empresa vinculada:       </label>
        <input
            id="cnpj"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 12.345.678/0001-90"
        />
        </div>
        {/* Email */}
        <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email:   </label>
        <input
          id="email"
          type="email"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="seu@email.com"
        />
      </div>
        {/* Senha */}
        <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Senha:
        </label>
        <input
          id="password"
          type="password"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="********"
        />

      

        </div>
        </div>
        </form>
        </div>
        </div>
        
    )

    
 

}