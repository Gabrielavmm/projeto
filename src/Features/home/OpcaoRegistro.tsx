import { useNavigate } from "react-router-dom";

export function Opcao(){
    const navigate = useNavigate();


    return(
        <div className=" flex flex-col justify-center px-4 bg-custom-bg" style={{textAlign:'center', minHeight: '120vh'}}>
        <h1 className=' font-sans' style={{fontSize:'50px', lineHeight: '110px', marginBottom: '10px'}}>
            <span className="text-custom-dark" style={{fontWeight:'30'}} >Data</span>
            <span className="text-custom-green" >Baker</span>
        </h1>

        <h2 style={{fontSize:'18px', marginTop:'5px'}}>Escolha o seu perfil:</h2>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            
        }}>
        <button
        onClick={() => navigate('/register')}
        style={{ fontSize: '15px',  height: '120px', width: '30%', backgroundColor: "#FFFFFF",  color:'#2F2F2F', 
                  border: '1px solid #E2E8F0', 
                borderRadius: '8px',
                  }}>Administrador</button>


        <button
        onClick={() => navigate('/registro-empresa')}
        style={{ fontSize: '15px',  height: '120px', width: '30%', backgroundColor: "#FFFFFF",  color:'#2F2F2F', 
                  border: '1px solid #E2E8F0', 
                borderRadius: '8px', marginTop: '5px'  }}>Empresa</button>

        <button
        onClick={() => navigate('/registro-funcionario')}
        style={{ fontSize: '15px',  height: '120px', width: '30%', backgroundColor: "#FFFFFF",  color:'#2F2F2F', 
                  border: '1px solid #E2E8F0', 
                borderRadius: '8px', marginTop: '5px'  }}>Funcionário</button>


        </div>
        <fieldset style={{
        marginTop: window.innerWidth < 768 ? '50px' : '160px',
        padding: '0',
        backgroundColor: '#E2E8F0',
        border: 'none',
        height: '1px'
      }}></fieldset>
     
        <button
          onClick={() => navigate('/login')}
          style={{marginTop: '10px', height: '35px', width:'60%', backgroundColor: '#D9D9D9', color: 'white', borderRadius: '5px',border: 'none', fontSize: '16px', fontWeight: 'semi-bold'}}>
            Voltar</button>
            </div>
                
        
    )
}