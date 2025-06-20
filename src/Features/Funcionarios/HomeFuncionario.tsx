import { useState, useEffect } from 'react';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import HeaderFuncionario from "../../components/HeaderFuncionario";
import { db } from "../../firebase";

interface Indicador {
  id: number;
  value: string;
  cnpj: string;
}

interface RegistroIndicador {
  indicadorId: number;
  indicadorNome: string;
  valor: string;
  horario: string;
  data: string;
  funcionarioId: string;
  funcionarioEmail: string;
  cnpj: string;
  criadoEm: any; // Usaremos serverTimestamp()
}

export function HomeFuncionario() {
  const [user, setUser] = useState<any>(null);
  const [cnpj, setCnpj] = useState<string>('');
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    indicadorId: '',
    indicadorNome: '',
    valor: '',
    horas: '',
    minutos: '',
    data: new Date().toISOString().split('T')[0] // Data atual como padrão
  });

  // 1. Verificação do usuário e CNPJ
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
              // Carrega nome do usuário se existir no documento
              const nomeFuncionario = userData.nome || user.displayName || 'Funcionário não identificado';
              setFormData(prev => ({
                ...prev,
                funcionarioNome: nomeFuncionario
              }));
              carregarIndicadores(userData.cnpj);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);
  // 2. Carregar indicadores disponíveis para o CNPJ
  const carregarIndicadores = async (cnpjEmpresa: string) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "indicadores"), 
        where("cnpj", "==", cnpjEmpresa)
      );
      
      const querySnapshot = await getDocs(q);
      const indicadoresData: Indicador[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.indicadores) {
          data.indicadores.forEach((ind: any) => {
            indicadoresData.push({
              id: ind.id,
              value: ind.value,
              cnpj: ind.cnpj
            });
          });
        }
      });
      
      setIndicadores(indicadoresData);
    } catch (error) {
      console.error("Erro ao carregar indicadores:", error);
      toast.error('Erro ao carregar indicadores');
    } finally {
      setLoading(false);
    }
  };

  // 3. Manipulação do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 4. Quando seleciona um indicador
  const handleIndicadorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedIndicador = indicadores.find(ind => ind.id.toString() === selectedId);
    
    if (selectedIndicador) {
      setFormData(prev => ({
        ...prev,
        indicadorId: selectedId,
        indicadorNome: selectedIndicador.value
      }));
    }
  };

  // 5. Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validações
      if (!formData.indicadorId) {
        toast.error('Selecione um indicador');
        return;
      }
      
      if (!formData.valor) {
        toast.error('Informe o valor');
        return;
      }
      
      if (!formData.horas || !formData.minutos) {
        toast.error('Informe o horário completo');
        return;
      }
      
      if (!formData.data) {
        toast.error('Informe a data');
        return;
      }

      // Formata o horário
      const horarioFormatado = `${formData.horas.padStart(2, '0')}:${formData.minutos.padStart(2, '0')}`;
      
      // Cria o objeto de registro
      const novoRegistro: Omit<RegistroIndicador, 'criadoEm'> = {
        indicadorId: Number(formData.indicadorId),
        indicadorNome: formData.indicadorNome,
        valor: formData.valor,
        horario: horarioFormatado,
        data: formData.data,
        funcionarioId: user.uid,
        funcionarioEmail: user.email || '',
        cnpj: cnpj
      };
      
      // Adiciona ao Firestore
      const docRef = await addDoc(collection(db, "registros_indicadores"), {
        ...novoRegistro,
        criadoEm: serverTimestamp()
      });
      
      toast.success('Registro salvo com sucesso!');
      
      // Limpa o formulário (opcional)
      setFormData({
        indicadorId: '',
        indicadorNome: '',
        valor: '',
        horas: '',
        minutos: '',
        data: new Date().toISOString().split('T')[0]
      });
      
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      toast.error('Erro ao salvar registro');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-custom-bg" style={{ textAlign: 'center', minHeight: '120vh' }}>
      <HeaderFuncionario />
      
      <form onSubmit={handleSubmit} style={{ width: '90%', maxWidth: '600px', marginTop: '20px' }}>
        {/* Campo de seleção do indicador */}
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'inter', textAlign: 'left', marginBottom: '10px', marginLeft: '12px' }}>
          Indicador
        </h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginLeft: '10px' }}>
          <select
            name="indicadorId"
            value={formData.indicadorId}
            onChange={handleIndicadorSelect}
            style={{ height: '40px', width: '100%', padding: '0 10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          >
            <option value="">Selecione um indicador</option>
            {indicadores.map((ind) => (
              <option key={ind.id} value={ind.id}>{ind.value}</option>
            ))}
          </select>
        </div>
        
        {/* Campo de valor */}
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'inter', textAlign: 'left', marginBottom: '10px', marginLeft: '12px' }}>
          Valor
        </h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginLeft: '10px' }}>
          <input
            type="text"
            name="valor"
            value={formData.valor}
            onChange={handleInputChange}
            style={{ height: '40px', width: '100%', padding: '0 10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>
        
        {/* Campo de horário */}
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'inter', textAlign: 'left', marginBottom: '10px', marginLeft: '12px' }}>
          Horário
        </h2>
        <div style={{ display: 'flex', gap: '10px', marginLeft: '12px', marginRight: '12px', alignItems: 'center' }}>
          <input 
            type="number"
            name="horas"
            placeholder="HH"
            min="0"
            max="23"
            value={formData.horas}
            onChange={handleInputChange}
            style={{ flex: 1, height: '80px', padding: '0 10px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'center', fontSize: '24px' }}
            required
          />
          <span style={{ fontSize: '32px', fontWeight: 'bold' }}>:</span>
          <input 
            type="number"
            name="minutos"
            placeholder="MM"
            min="0"
            max="59"
            value={formData.minutos}
            onChange={handleInputChange}
            style={{ flex: 1, height: '80px', padding: '0 10px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'center', fontSize: '24px' }}
            required
          />
        </div>
        
        {/* Campo de data */}
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'inter', textAlign: 'left', marginBottom: '10px', marginLeft: '12px' }}>
          Data
        </h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginLeft: '10px' }}>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleInputChange}
            style={{ height: '40px', width: '100%', padding: '0 10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>
        
        <fieldset style={{ marginTop: '200px', padding: '1.5px', backgroundColor: '#E2E8F0', border: 'none' }}></fieldset>
        
        <button 
          type="submit"
          style={{ marginTop: '15px', height: '35px', width: '85%', backgroundColor: '#22C55E', color: 'white', borderRadius: '5px', border: 'none', fontSize: '16px', fontWeight: 'semi-bold' }}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}

export default HomeFuncionario;