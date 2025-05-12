import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';


export function HomeAdmin() {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);

    


    return (
        <div className="flex flex-col items-center justify-center  bg-custom-bg"style={{textAlign:'center', minHeight: '120vh'}}>
           
            <Header />
           

            
        
            <button
                onClick={() => navigate('/indicadores')}
                
                style={{ fontSize: '15px', marginTop: '35px', height: '180px', width: '36%', backgroundColor: "#FFFFFF",  color:'#2F2F2F', 
                flexDirection: 'column',  border: '1px solid #D1D1D1', 
                borderRadius: '8px'   }}
                >
                Indicadores
                <p style={{color: '#717171', fontSize: '11px', marginTop: '3px' }}>Cadastre e edite indicadores de desempenho.</p>
                </button>
                <button
                onClick={() => navigate('/controle-funcionarios')}
                
                style={{ fontSize: '15px', marginTop: '35px', height: '180px', width: '36%', backgroundColor: "#FFFFFF",  color:'#2F2F2F', 
                flexDirection: 'column', marginLeft: '30px',  border: '1px solid #D1D1D1',
                borderRadius: '8px' }}
                >
                Funcionários
                <p style={{color: '#717171', fontSize: '11px', marginTop: '3px' }}>Vizualize e configure informações dos funcionários</p>
                </button>

             
                </div>
                
    
    );  
}