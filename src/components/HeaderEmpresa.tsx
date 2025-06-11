import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeaderEmpresa = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const navigate = useNavigate();
  
      const handleLogout = async() => {
          try {
              const auth = getAuth();
              await signOut(auth);
              navigate('/login');
          } catch (error) {
              console.error("Erro ao fazer logout:", error);
          }
      };
  
      const toggleSidebar = () => {
          setIsSidebarOpen(!isSidebarOpen);
      };


       // Estilos reutilizáveis
    const hamburgerLine = {
    display: 'block',
    width: '24px',
    height: '1px',
    backgroundColor: '#4B5563',
    marginBottom: '6px',
    
    transition: 'all 0.3s ease-in-out'
  };


  return (
    <>
      {/* Cabeçalho */}
      <div style={{
        backgroundColor: "#FFFFFF",
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '12px'
      }}>
        {/* Botão Hamburguer */}
        <button 
          onClick={toggleSidebar}
          style={{
            marginRight: 'auto',
            background: 'transparent',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            border: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span style={{
            ...hamburgerLine,
            transform: isSidebarOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', color: '#2F2F2F', padding: '1px', 
          }}></span>
          <span style={{
            ...hamburgerLine,
            opacity: isSidebarOpen ? 0 : 1, padding: '1px'
          }}></span>
          <span style={{
            ...hamburgerLine,
            marginBottom: 0,
            transform: isSidebarOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', padding: '1px'
          }}></span>
        </button>
        
        {/* Título */}
        <h1 style={{
          fontFamily: 'sans-serif',
          fontSize: '23px',
          lineHeight: '28px',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          <span style={{ fontWeight: '300', color: '#333333' }}>Data</span>
          <span style={{ color: '#4CAF50' }}>Baker</span>
        </h1>
      </div>
    {/* Sidebar */}
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '256px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        zIndex: 50,
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out'
      }}>
        <div >
          {/* Itens do menu */}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <h1 style={{
                marginTop: '-18px',
                fontFamily: 'sans-serif',
                fontSize: '18px',
                backgroundColor: '#F6F6F6',
                padding: '10px',
                lineHeight: '28px',
               
            }}>
            <span style={{ fontWeight: '300', color: '#333333' }}>Data</span>
            <span style={{ color: '#4CAF50' }}>Baker</span></h1>
            <li style={{
                fontSize: '15px',
                fontWeight: 'regular',
                width: '42%', 
                marginTop: '40px',
            }}>Gráficos</li>
            
            <li style={{
             fontSize: '15px',
                fontWeight: 'regular',
                width: '53%' , marginTop: '15px'
            }} onClick={() => navigate('/empresa')} >Funcionários</li>
            <li style={{
                fontSize: '15px',
                fontWeight: 'regular',
                width: '50%' , marginTop: '15px'
            }} onClick={() => navigate('/editar-perfil-empresa')}>Editar perfil</li>
            <li style={{
                fontSize: '15px',
                fontWeight: 'regular',
                width: '30%' , marginTop: '15px',
                color: '#FF3C3C'
            }} onClick={handleLogout
            }>Sair</li>
            
          </ul>
        </div>
      </div>

      {/* Overlay (quando sidebar estiver aberta) */}
      {isSidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
          onClick={toggleSidebar}
        >
            
        </div>
      )}
    </>
  );
    }; export default HeaderEmpresa;