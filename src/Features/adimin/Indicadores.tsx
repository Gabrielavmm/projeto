import Header from '../../components/Header';
import React from 'react';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDoc, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import KebabMenu from '../../components/KebabMenu';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { indicadoresService } from '../../Shared/lib/firestore/indicadores/indicadoresService';
import toast from "react-hot-toast";


export function Indicadores() {
  const [caixinha, setCaixinha] = useState<{ id: number; value: string, isMenuOpen?: boolean }[]>([]);
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docId, setDocId] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cnpj, setCnpj] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  // Carrega usuário e CNPJ
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData?.cnpj) {
              setCnpj(userData.cnpj);
            } else {
              alert('CNPJ não encontrado nos dados do usuário!');
              navigate('/login');
            }
          }
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          alert('Erro ao carregar dados do usuário');
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Carrega indicadores quando CNPJ muda
  useEffect(() => {
    const carregarIndicadores = async () => {
      if (!cnpj) return;
      
      try {
        setLoading(true);
        const indicadores = await indicadoresService.getIndicadores(cnpj);
        
        if (indicadores.length === 0) {
          await indicadoresService.createIndicadoresDoc(cnpj);
        }
        
        setCaixinha(indicadores);
        setDocId(cnpj);
      } catch (error) {
        console.error("Erro ao carregar:", error);
        alert('Erro ao carregar indicadores');
      } finally {
        setLoading(false);
      }
    };
    
    carregarIndicadores();
  }, [cnpj]);

  const AdicionarCaixinhas = () => {
    const novaCaixinha = {
      id: Date.now(),
      value: '',
      cnpj: cnpj,
    };
    
    setCaixinha([...caixinha, novaCaixinha]);
    setEditandoId(novaCaixinha.id);
    
    // Foco automático no novo input
    setTimeout(() => {
      
      const inputElement = document.getElementById(`input-${novaCaixinha.id}`);
      inputElement?.focus();
    }, 50);
  };

  const atualizarCaixinha = (id: number, novoValor: string) => {
    if (editandoId === id) {
      setCaixinha(caixinha.map(item => 
        item.id === id ? { ...item, value: novoValor } : item
      ));
    }
  };

  const removerCaixinha = async (id: number) => {
    try {
      const novasCaixinhas = caixinha.filter(item => item.id !== id);
      setCaixinha(novasCaixinhas);
      await indicadoresService.updateIndicadores(cnpj, novasCaixinhas);
    } catch (error) {
      console.error("Erro ao remover:", error);
      alert('Erro ao remover indicador');
    }
  };

  const handleSubmit = async () => {
    try {
      // Validações
      if (!cnpj) {
        alert('CNPJ não identificado! Faça login novamente.');
        return;
      }

      if (caixinha.some(c => c.value.trim() === '')) {
        toast.error('Preencha todos os indicadores!');
        
       return;
      }

      setUpdating(true);
      await indicadoresService.saveIndicadores(cnpj, caixinha);
      toast.success('Indicadores atualizados com sucesso!');
      
      setTimeout(() => {
        navigate('/admin');
      }, 1500)
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error('Erro ao salvar os indicadores');
      
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

   
    
  

    return (
      <div className='bg-custom-bg' style={{ minHeight: '120vh'}}>
        <Header />
        
        <div style={{ 
      width: '100%', 
      maxWidth: '800px',  
      margin: '0 auto',
      padding: window.innerWidth < 768 ? '0 20px' : '0',
      boxSizing: 'border-box',
      paddingBottom: '200px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2  style={{fontSize: '14px', marginTop:'5px', marginLeft:'5px'}}>Meus indicadores:</h2>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" style={{ flexDirection: 'column', marginBottom:'5px', backgroundColor:'#FFFFFF', color:'#22C55E',
      borderColor:'#22C55E', borderRadius:'10px', padding:'2px', marginRight:'5px'}} onClick={AdicionarCaixinhas}>Adicionar Indicador</button>
        </div>

        {caixinha.map((caixinha, index) => (
      <div key={caixinha.id} style={{ 
        marginBottom: '0px', 
        border: 'none', 
        borderRadius: '8px',
        position: 'relative',
        textAlign: 'center'
      }}>
       
         <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px'
      }}>
        <KebabMenu 
          onEdit={() => {
            setEditandoId(caixinha.id);
            // Focar no input quando clicar em editar
            const inputElement = document.getElementById(`input-${caixinha.id}`);
            if (inputElement) {
              inputElement.focus();
            }
          }}
          onDelete={() => removerCaixinha(caixinha.id)}
        />
      </div>
        
      
        <input
          id={`input-${caixinha.id}`}
          type="text"
          style={{height: '30px', width: '100%', marginBottom:'7px', outline: 'none', }}
          value={caixinha.value}
          onChange={(e) => atualizarCaixinha(caixinha.id, e.target.value)}
          onBlur={() => setEditandoId(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditandoId(null);
            }
          }}
          readOnly={editandoId !== caixinha.id} // Importante: só editável quando em modo de edição
          placeholder="Digite o nome do indicador"  
        />
        




        </div>
        
    ))}
    </div>
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      
      padding: '15px',
     
    }}>

<div style={{ 
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '800px',
      padding: window.innerWidth < 768 ? '0 20px' : '0',
      
    }}>
      <div style={{ 
        width: '200vw',
        height: '0',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        <fieldset style={{
          marginTop: window.innerWidth < 768 ? '25px' : '30px',
          padding: '0',
          backgroundColor: '#E2E8F0',
          border: 'none',
          height: '1px',
          width: '100%'
        }}></fieldset>
      </div>
      
      <button 
        onClick={handleSubmit}
        disabled={updating}
        style={{
          marginTop: '15px', 
          height: '40px', 
          width: '85%', 
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'block',
          backgroundColor: '#22C55E', 
          color: 'white', 
          borderRadius: '5px',
          border: 'none', 
          fontSize: '16px', 
          fontWeight: 'semi-bold',
        }}
      >
        {updating ? 'Salvando...' : 'Salvar'}
      </button>
      
      <button
        onClick={() => navigate('/admin')}
        style={{
          marginTop: '10px',
          marginBottom: '20px',
          height: '40px', 
          width: '85%',
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'block',
          backgroundColor: '#D9D9D9', 
          color: 'white',
          borderRadius: '5px',
          border: 'none', 
          fontSize: '16px', 
          fontWeight: 'semi-bold',
        }}
      >
        Voltar
      </button>
      </div>
      

      </div>

      </div>
    
 
    );
  }


