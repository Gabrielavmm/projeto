import Header from '../../components/Header';
import React from 'react';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDoc, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import KebabMenu from '../../components/KebabMenu';


export function Indicadores() {
    const [caixinha, setCaixinha] = useState<{ id: number; value: string, isMenuOpen?:boolean }[]>([]);
    const navigate = useNavigate();
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [docId, setDocId] = useState<string | null>(null);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [cnpj, setCnpj] = useState<string>(''); // Estado para armazenar o CNPJ
    
    


    
   


    const AdicionarCaixinhas = () => {
      if (!cnpj) {
        alert('CNPJ não identificado! Faça login novamente.');
        return;
    }
      
      const novaCaixinha = {
        id: Date.now(),
        value: '',
        cnpj: cnpj, 
      };
      
      setCaixinha([...caixinha, novaCaixinha]);
      setEditandoId(novaCaixinha.id);
      setTimeout(() => {
        const inputElement = document.getElementById(`input-${novaCaixinha.id}`);
        if (inputElement) {
          inputElement.focus();
        }
      }, 50);
    }

    const atualizarCaixinha = (id: number, novoValor: string) => {
      if(editandoId == id){
      setCaixinha(caixinha.map(item => 
        item.id === id ? { ...item, value: novoValor } : item
      ));
    }
  };

  const removerCaixinha = async (id: number) => {
    try {
      const novasCaixinhas = caixinha.filter(item => item.id !== id);
      setCaixinha(novasCaixinhas);
      
      // Atualiza o documento fixo
      await setDoc(doc(db, "indicadores", "lista_principal"), {
        indicadores: novasCaixinhas
      }, { merge: true });
      
    } catch (error) {
      console.error("Erro ao remover:", error);
      alert('Erro ao remover indicador');
    }
  };

    const handleSubmit = async () => {
      try {
        if (caixinha.some(c => c.value.trim() === '')) {
          alert('Preencha todos os indicadores!');
          return;
        }
    
        setUpdating(true);
    
        // Sempre usar o mesmo documento (cria ou atualiza)
        const docRef = doc(db, "indicadores", "lista_principal");
        
        await setDoc(docRef, {
          indicadores: caixinha,
          ultimaAtualizacao: new Date()
        }, { merge: true }); // O merge evita sobrescrever outros campos
    
        setDocId("lista_principal"); // Armazena o ID fixo
        alert('Indicadores atualizados com sucesso!');
        navigate('/admin');
        
      } catch (error) {
        console.error("Erro ao salvar:", error);
        alert('Erro ao salvar os indicadores');
      } finally {
        setUpdating(false);
      }
    };
    useEffect(() => {
      const carregarIndicadores = async () => {
        try {
          const docRef = doc(db, "indicadores", "lista_principal");
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setDocId("lista_principal");
            setCaixinha(docSnap.data().indicadores || []);
          } else {
            // Cria documento vazio se não existir
            await setDoc(docRef, { indicadores: [] });
            setDocId("lista_principal");
          }
        } catch (error) {
          console.error("Erro ao carregar:", error);
        } finally {
          setLoading(false);
        }
      };
      carregarIndicadores();
    }, []);

    return (
      <div className='bg-custom-bg' style={{ minHeight: '120vh'}}>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2  style={{fontSize: '15px', marginTop:'5px', marginLeft:'5px'}}>Meus indicadores:</h2>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" style={{ flexDirection: 'column', marginBottom:'5px', backgroundColor:'#FFFFFF', color:'#22C55E',
      borderColor:'#22C55E', borderRadius:'10px', padding:'5px', marginRight:'5px'}} onClick={AdicionarCaixinhas}>Adicionar Indicador</button>
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
          style={{
            height: '30px', 
            width: '90%',
            padding: '8px',
            border: '1px solid #E5E7EB',
            borderRadius: '4px'
          }}
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
      <fieldset style={{
      marginTop: '400px',
      padding: '1.5px',
      backgroundColor: '#E2E8F0',
      border: 'none'
    }}> </fieldset>
     
        <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Centraliza horizontalmente
      marginTop: '15px',
      width: '100%',
    }}>
     
      <button 
        onClick={handleSubmit}
        disabled={updating}
        style={{  height: '35px', width:'85%', backgroundColor: '#22C55E', color: 'white', borderRadius: '5px',border: 'none', fontSize: '16px', fontWeight: 'semi-bold'}}
      >
        {updating ? 'Salvando...' : 'Cadastrar'}
      </button>
      <button
        onClick={() => navigate('/admin')}
        style={{marginTop: '10px',  height: '35px', width:'85%', backgroundColor: '#D9D9D9', color: 'white', borderRadius: '5px',border: 'none', fontSize: '16px', fontWeight: 'semi-bold'}}
      >
        Voltar
      </button>
      </div>
    
  </div>
    );
  }


