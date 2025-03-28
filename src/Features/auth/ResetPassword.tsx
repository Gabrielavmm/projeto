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
    <div>
        <h1>DataBaker</h1>
        <h2>Esqueceu a senha?</h2>
        <form onSubmit={handleSubmit}>
            <fieldset>
                <label htmlFor="email">E-mail<input id="email" type="email" value={email} name="email" onChange={(e) => setEmail(e.target.value) }required/></label>
            </fieldset>
            <button type="submit">Enviar</button>
        </form>
        <div>
            <Link to="/login">Voltar</Link>
        </div>
    </div>
);
}
