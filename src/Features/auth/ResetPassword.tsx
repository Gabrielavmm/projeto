import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../Shared/lib/firestore/auth";
import { useState } from "react";


export function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try{
            await resetPassword(email);
            setMessage('Um e-mail foi enviado com as instruções para redefinir sua senha');
        } catch (error) {
            setMessage('Erro ao tentar redefinir a senha');
        }

};

return (
    
    <div className=" flex flex-col justify-center px-4 bg-custom-bg" style={{textAlign:'center', minHeight: '100vh'}}>
      <h1 className=' font-sans' style={{fontSize:'60px', lineHeight: '110px', marginBottom: '15px'}}>
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 " 
         style={{ 
          display: 'block', 
          marginBottom: '7px', 
          fontSize: '13px', 
          width: '100%',
          textAlign: 'left'
        }}>
          Email:</label>
        

          <input
          id="email"
          type="email"
          value={email}
          onChange={(e) =>  setEmail(e.target.value)}
          className="w-full  p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          style={{height: '30px', width: '100%', marginBottom:'7px', outline: 'none', }}
          placeholder="Digite seu email para recuperar senha"
          required
        />
           
               
            
        <button type="submit" 
        onClick={handleSubmit}
        style={{marginTop: '22px', height: '30px', width:'100%', backgroundColor: '#22C55E', color: 'white', borderRadius: '5px',border: 'none', fontSize: '12px', fontWeight: 'semi-bold'}}>Enviar</button>
        </div>  
        </form>
        <fieldset style={{
        marginTop: window.innerWidth < 768 ? '380px' : '460px',
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

            <Link to="/login">Voltar</Link>

        </div>
        
    </div>
);
}
