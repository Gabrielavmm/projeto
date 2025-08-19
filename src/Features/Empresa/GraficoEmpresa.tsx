import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { db } from '../../firebase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import HeaderEmpresa from '../../components/HeaderEmpresa';

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

export function GraficoEmpresa() {
  const [user, setUser] = useState<any>(null);
  const [cnpj, setCnpj] = useState<string>('');
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [registros, setRegistros] = useState<RegistroIndicador[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // 1. Carrega usuário e CNPJ
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
              carregarDados(userData.cnpj);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          toast.error('Erro ao carregar dados do usuário');
          navigate('/admin');
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Carrega todos os indicadores e registros do CNPJ
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
      
      // Carrega TODOS os registros do CNPJ (não apenas de um funcionário)
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

  // 3. Processa dados para o gráfico consolidado (agrupado por data)
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

  // 4. Processa dados para um indicador específico (com média por data)
  const processarDadosIndicador = (indicadorId: number) => {
    const registrosFiltrados = registros.filter(registro => registro.indicadorId === indicadorId);
    const dadosPorData: Record<string, { sum: number; count: number }> = {};
    
    registrosFiltrados.forEach(registro => {
      if (!dadosPorData[registro.data]) {
        dadosPorData[registro.data] = { sum: 0, count: 0 };
      }
      
      const valorNumerico = isNaN(Number(registro.valor)) ? 0 : Number(registro.valor);
      dadosPorData[registro.data].sum += valorNumerico;
      dadosPorData[registro.data].count += 1;
    });
    
    return Object.entries(dadosPorData).map(([data, { sum, count }]) => ({
      data,
      valor: count > 0 ? (sum / count) : 0, // Média dos valores
      totalRegistros: count
    })).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  };

  // 5. Exportar para PDF
  const exportToPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;
  
    try {
      setIsGeneratingPDF(true);
      
      // Salva o estado original do layout
      const originalStyles = {
        width: element.style.width,
        height: element.style.height,
        overflow: element.style.overflow
      };
  
      // Força dimensões fixas para captura consistente
      element.style.width = '800px'; // Largura fixa para desktop
      element.style.height = 'auto';
      element.style.overflow = 'visible';
  
      // Scroll para o topo e aguarda renderização
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 500));
  
      const canvas = await html2canvas(element, {
        scale: 3, // Aumenta a qualidade
        useCORS: true,
        allowTaint: true,
        width: 800, // Largura consistente
        height: element.scrollHeight,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800, // Força viewport desktop
        windowHeight: element.scrollHeight
      });
  
      // Restaura estilos originais
      element.style.width = originalStyles.width;
      element.style.height = originalStyles.height;
      element.style.overflow = originalStyles.overflow;
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      // Divide em múltiplas páginas se necessário
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      while (position < pdfHeight) {
        if (position > 0) {
          pdf.addPage();
        }
        
        const remainingHeight = pdfHeight - position;
        const pageImgHeight = Math.min(pageHeight, remainingHeight);
        
        pdf.addImage(
          imgData, 
          'PNG', 
          0, 
          -position * (pageHeight / pdfHeight), 
          pdfWidth, 
          pdfHeight
        );
        
        position += pageHeight;
      }
  
      pdf.save('relatorio-admin.pdf');
      
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Falha ao gerar PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    
      <div className="flex flex-col items-center justify-center  bg-custom-bg"style={{textAlign:'center', minHeight: '120vh'}}>
    <HeaderEmpresa />
    <div className="w-full max-w-6xl px-4 md:px-6" ref={pdfRef} style={{ minWidth: '800px' }}>
    <div className="flex justify-between items-center mb-6">
    <button
  onClick={exportToPDF}
  disabled={isGeneratingPDF || registros.length === 0}
  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-0.3 px-0.4 rounded-md flex items-center text-xs transition-colors"
>
  {isGeneratingPDF ? (
    <svg className="animate-spin h-3 w-3 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : (
    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>
  )}
  {isGeneratingPDF ? 'Gerando...' : 'Exportar'}
</button>
</div>

      {/* Gráfico Consolidado */}
      {registros.length > 0 && (
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
      )}

      {/* Gráficos por Indicador */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {indicadores.map((indicador) => {
          const dadosIndicador = processarDadosIndicador(indicador.id);
          
          if (dadosIndicador.length === 0) return null;
          
          return (
            <div key={indicador.id} className="bg-white rounded-lg shadow-md p-3 md:p-4">
              <h3 className="text-sm md:text-base font-medium mb-2 md:mb-3" style={{fontSize: '12px'}}>
                {indicador.value}
              </h3>
              <p className="text-xs text-gray-500 mb-1 md:mb-2" style={{fontSize: '10px'}}>
                Total de registros: {dadosIndicador.reduce((acc, curr) => acc + curr.totalRegistros, 0)}
              </p>
              <div style={{ height: '250px', marginRight: '10px' }}>
                <ResponsiveContainer width="99%" height="100%">
                  <LineChart data={dadosIndicador}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line 
                      type="monotone"
                      dataKey="valor"
                      name="Média"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
          
}