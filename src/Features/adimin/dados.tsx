import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../../Shared/lib/firestore/auth";
import { useState } from "react";
import toast from "react-hot-toast";

export function Dados(){
    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
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

        <form onSubmit={handleSubmit}>
            <fieldset>
                <label htmlFor="name">Nome completo<input id="name" type="text" value={name} name="name" onChange={(e) => setName(e.target.value) }required/></label>
            </fieldset>
            <fieldset>
                <label htmlFor="Cnpj">CNPJ da empresa vinculada<input id="Cnpj da empresa vinculada" type="text" value={cnpj} name="cnpj" onChange={(e) => setCnpj(e.target.value) }required/></label>
            </fieldset>
            <fieldset>
                <label htmlFor="email">E-mail<input id="email" type="email" value={email} name="email" onChange={(e) => setEmail(e.target.value) }required/></label>
            </fieldset>
            <fieldset>
                <label htmlFor="password">Senha<input id="password" type="password" name="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}/></label>
            </fieldset>
            <button type="submit">CADASTRAR</button>
        </form>
        <div className="link-auth">
            <Link to="/login">Já tenho conta</Link>
        </div>
    </div>

)
}