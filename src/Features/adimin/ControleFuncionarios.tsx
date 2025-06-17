import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Header from '../../components/Header';
import { useNavigate } from "react-router-dom";
interface Funcionario {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function ControleFuncionario() {
  const [searchTerm, setSearchTerm] = useState("");
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  


  useEffect(() => {
    const fetchFuncionarios = async () => {
      setLoading(true);
      setError("");
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

       

        // Primeiro, pegar o CNPJ da empresa do usuário logado
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          throw new Error("Dados do usuário não encontrados");
        }

        const userData = userDoc.data();
        console.log("Dados do usuário:", userData);
        
        if (!userData.cnpj) {
          throw new Error("CNPJ não encontrado nos dados do usuário");
        }

        const empresaCnpj = userData.cnpj;
        console.log("CNPJ da empresa:", empresaCnpj);

        // Buscar todos os usuários com o mesmo CNPJ que são funcionários ou admins
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("cnpj", "==", empresaCnpj));
        const querySnapshot = await getDocs(q);

        console.log("Número de documentos encontrados:", querySnapshot.size);

        const funcionariosList: Funcionario[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Documento encontrado:", doc.id, data);
          
          // Verificar se os campos obrigatórios existem
          if (!data.name || !data.email || !data.role) {
            console.warn("Documento com campos incompletos:", doc.id);
            return;
          }

          // Filtrar apenas funcionários e admins (se quiser incluir admins)
          if (data.role === "funcionario" || data.role === "admin") {
            funcionariosList.push({
              id: doc.id,
              name: data.name,
              email: data.email,
              role: data.role
            });
          }
        });

        console.log("Lista de funcionários encontrados:", funcionariosList);
        setFuncionarios(funcionariosList);
        setFilteredFuncionarios(funcionariosList);
      } catch (err) {
        console.error("Erro ao buscar funcionários:", err);
        setError(`Erro ao carregar funcionários: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFuncionarios(funcionarios);
    } else {
      const filtered = funcionarios.filter(funcionario =>
        funcionario.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFuncionarios(filtered);
    }
  }, [searchTerm, funcionarios]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-custom-bg" style={{ minHeight: '120vh' }}>
        <Header />
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-custom-bg" style={{ minHeight: '120vh' }}>
        <Header />
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-custom-bg" style={{ textAlign: 'center', minHeight: '120vh' }}>
      <Header />
      
      <div style={{ width: '90%', maxWidth: '600px', marginTop: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'inter', textAlign: 'left', marginBottom: '10px' }}>
          Buscar Funcionário
        </h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Digite o nome do funcionário"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ height: '40px', width: '100%', padding: '0 10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        
        <div style={{ width: '100%', textAlign: 'left' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
            Lista de Funcionários
          </h3>
          
          {filteredFuncionarios.length === 0 ? (
            <p>Nenhum funcionário encontrado</p>
          ) : (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '15px'
            }}>
              {filteredFuncionarios.map((funcionario) => (
                <div 
                  key={funcionario.id}
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 'bold', margin: 0 }}>{funcionario.name}</p>
                    <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>{funcionario.email}</p>
                  </div>
                  <span style={{ 
                    backgroundColor: funcionario.role === 'admin' ? '#f0f7ff' : '#f0fff0',
                    color: funcionario.role === 'admin' ? '#0066cc' : '#00a86b',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {funcionario.role === 'admin' ? 'Administrador' : 'Funcionário'}
                  </span>
                  
                </div>
              ))}
            </div>
            
          )}
          <fieldset style ={{marginTop:'200px',  padding: '1.5px', backgroundColor: '#E2E8F0', border: 'none' }}></fieldset>
          
          <button
          onClick={() => navigate('/admin')}
          style={{marginTop: '10px', height: '35px', width:'85%', backgroundColor: '#D9D9D9', color: 'white', borderRadius: '5px',border: 'none', fontSize: '16px', fontWeight: 'semi-bold'}}>
            Voltar</button>
                
                
          
        </div>
      </div>
      
    </div>
  );
}