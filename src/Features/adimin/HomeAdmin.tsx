import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase';
import Header from '../../components/Header';
import { toast } from 'react-hot-toast';

interface Indicador {
  id: number;
  value: string;
  cnpj: string;
}

interface RegistroIndicador {
  id?: string;
  indicadorId: number;
  indicadorNome: string;
  valor: string;
  horario: string;
  data: string;
  funcionarioId: string;
  funcionarioEmail: string;
  cnpj: string;
}

export function HomeAdmin() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<RegistroIndicador[]>([]);
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [loading, setLoading] = useState(true);
  const [cnpj, setCnpj] = useState('');

  // Carrega dados do usuário e indicadores
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData?.cnpj) {
              setCnpj(userData.cnpj);
              carregarDados(userData.cnpj);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          toast.error('Erro ao carregar dados do usuário');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const carregarDados = async (cnpjEmpresa: string) => {
    try {
      setLoading(true);
      
      // Carrega indicadores
      const qIndicadores = query(
        collection(db, "indicadores"), 
        where("cnpj", "==", cnpjEmpresa)
      );
      
      const querySnapshotInd = await getDocs(qIndicadores);
      const indicadoresData: Indicador[] = [];
      
      querySnapshotInd.forEach((doc) => {
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
      
      // Carrega registros
      const qRegistros = query(
        collection(db, "registros_indicadores"),
        where("cnpj", "==", cnpjEmpresa)
      );
      
      const querySnapshotReg = await getDocs(qRegistros);
      const registrosData: RegistroIndicador[] = [];
      
      querySnapshotReg.forEach((doc) => {
        registrosData.push({
          id: doc.id,
          ...doc.data()
        } as RegistroIndicador);
      });
      
      setRegistros(registrosData);
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Processa dados para o gráfico consolidado
  const processarDadosConsolidados = () => {
    const dadosPorData: Record<string, any> = {};
    
    registros.forEach(registro => {
      if (!dadosPorData[registro.data]) {
        dadosPorData[registro.data] = { data: registro.data };
      }
      
      const valorNumerico = isNaN(Number(registro.valor)) ? 0 : Number(registro.valor);
      dadosPorData[registro.data][registro.indicadorNome] = valorNumerico;
    });
    
    return Object.values(dadosPorData).sort((a, b) => {
      return new Date(a.data).getTime() - new Date(b.data).getTime();
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-custom-bg" style={{textAlign:'center', minHeight: '120vh'}}>
      <Header />
      
      {/* Botões de Navegação */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        padding: '0 20px',
        boxSizing: 'border-box',
        marginTop: '20px'
      }}>
        <div style={{
          display: 'flex',
          width: window.innerWidth < 768 ? '100%' : 'auto',
          maxWidth: '700px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => navigate('/indicadores')}
            style={{ 
              fontSize: '15px', 
              height: '110px', 
              width: window.innerWidth < 768 ? '40%' : '200px',
              backgroundColor: "#FFFFFF",  
              color: '#2F2F2F', 
              display: 'flex',
              flexDirection: 'column',  
              border: '1px solid #D1D1D1', 
              borderRadius: '8px',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            Indicadores
            <p style={{color: '#717171', fontSize: '11px', marginTop: '5px' }}>
              Cadastre e edite indicadores de desempenho.
            </p>
          </button>
          
          <button
            onClick={() => navigate('/controle-funcionarios')}
            style={{ 
              fontSize: '15px', 
              height: '110px', 
              width: window.innerWidth < 768 ? '40%' : '200px',
              backgroundColor: "#FFFFFF",  
              color: '#2F2F2F', 
              display: 'flex',
              flexDirection: 'column', 
              marginLeft: window.innerWidth < 768 ? '30px' : '20px',
              border: '1px solid #D1D1D1',
              borderRadius: '8px',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            Funcionários
            <p style={{color: '#717171', fontSize: '11px', marginTop: '5px' }}>
              Visualize e configure informações dos funcionários
            </p>
          </button>
        </div>
      </div>

      {/* Gráfico Principal */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4" style={{fontSize: '12px'}}>
            Evolução de Todos os Indicadores por Data
          </h2>
          <div style={{ height: '350px', marginRight: '15px' }}>
            <ResponsiveContainer width="99%" height="100%">
              <LineChart data={processarDadosConsolidados()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [`${value}`, name]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                {indicadores.map((indicador) => (
                  <Line
                    key={indicador.id}
                    type="monotone"
                    dataKey={indicador.value}
                    name={indicador.value}
                    stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      
    </div>
  );
}