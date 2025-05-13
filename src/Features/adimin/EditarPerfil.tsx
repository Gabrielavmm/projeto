import { getAuth, sendEmailVerification, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc} from "firebase/firestore";
import { get } from "http";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import Header from '../../components/Header';

import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";

export function EditarPerfil() {
  const [userData, setUserData] = useState({
    name: "",
    cnpj: "",
    email: "",
    newpassword: "",
    senhaAtual: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
 


  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        console.log("Usuário não autenticado, redirecionando...");
        navigate('/login');
        return;
      }

      try {
        console.log("Buscando dados para UID:", user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Dados encontrados:", data);
          
          setUserData({
            name: data.name || '',
            cnpj: data.cnpj || '',
            email: data.email || user.email || '',
            newpassword: '',
            senhaAtual: ''
          });
        } else {
          console.error("Documento não encontrado no Firestore");
          toast.error("Perfil não encontrado");
        }
      } catch (error) {
        console.error("Erro detalhado:", error);
        toast.error("Falha ao carregar perfil");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    // Adiciona um pequeno delay para garantir que o auth esteja pronto
    const timer = setTimeout(() => {
      fetchUserData();
    }, 400);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      // 1. Verificação de alterações sensíveis
      const emailChanged = user!.email !== userData.email;
      const passwordChanged = !!userData.newpassword;
  
      if (emailChanged || passwordChanged) {
        if (!userData.senhaAtual) {
          toast.error("Digite sua senha atual para confirmar alterações");
          return;
        }
  
        // 2. Reautenticação
        const credential = EmailAuthProvider.credential(
          user!.email!, 
          userData.senhaAtual
        );
        
        await reauthenticateWithCredential(user!, credential);
  
        // 3. Atualizações sensíveis (Authentication primeiro)
        if (emailChanged) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            toast.error('Por favor, insira um email válido');
            return;
          }
          
          try {
            // Primeiro envia email de verificação para o NOVO email
            await sendEmailVerification(user!);
            toast.success('Email de verificação enviado. Por favor, verifique seu novo email antes de continuar.');
            
            // Atualiza o email no Firestore (mas não no Authentication ainda)
            const userRef = doc(db, "users", user!.uid);
            await updateDoc(userRef, {
              name: userData.name,
              cnpj: userData.cnpj,
              email: userData.email,
              emailVerified: false // Marca como não verificado
            });
  
            // Não atualiza o email no Authentication ainda
            toast('Por favor, verifique seu novo email e depois tente novamente');
            return;
          } catch (error) {
            console.error("Falha ao enviar email de verificação:", error);
            throw error;
          }
        }
  
        if (passwordChanged) {
          await updatePassword(user!, userData.newpassword);
          toast.success('Senha atualizada com sucesso!');
        }
      }
  
      // 4. Se não houve mudança de email, atualiza outros dados
      if (!emailChanged) {
        const userRef = doc(db, "users", user!.uid);
        await updateDoc(userRef, {
          name: userData.name,
          cnpj: userData.cnpj
        });
        toast.success('Perfil atualizado com sucesso!');
        navigate('/admin');
      }
    } catch (error) {
      console.error(error);
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/requires-recent-login':
            toast.error('Sessão expirada. Faça login novamente');
            break;
          case 'auth/weak-password':
            toast.error('Senha muito fraca (mínimo 6 caracteres)');
            break;
          case 'auth/wrong-password':
            toast.error('Senha atual incorreta');
            break;
          case 'auth/email-already-in-use':
            toast.error('Este email já está em uso por outra conta');
            break;
          case 'auth/invalid-email':
            toast.error('O email fornecido é inválido');
            break;
          case 'auth/operation-not-allowed':
            toast.error('Verifique seu novo email antes de alterar');
            break;
          default:
            toast.error(`Erro ao atualizar: ${error.message}`);
        }
      } else {
        toast.error('Erro desconhecido ao atualizar perfil');
      }
    } finally {
      setUpdating(false);
    }
  };
  


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{}}>
        <p className="text-gray-500">Carregando perfil...</p>
      </div>
    );
  }
  






  return (
    <div className="flex flex-col items-center justify-center  bg-custom-bg"style={{textAlign:'center', minHeight: '120vh'}}>
           
            <Header />

            {loading ? (
            <p>Carregando dados do perfil...</p>
          ) : (
        <div className="relative">
        <label htmlFor="nome" className="font-medium bg-custom-dark" style={{ display: 'block', marginBottom: '7px', fontSize: '13px', width: '38%', marginTop: '40px'}}>
          Nome completo:
        </label>
        <input
          id="nome"
          type="text"
          value={userData.name}
          onChange={(e) => setUserData({...userData, name: e.target.value})}
          color="red"
          className="w-full p-4 text-base bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500" 
          style={{height: '30px', width: '81%'}}
          required
        />
        <div>
        {/* CNPJ */}
        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 " style={{ display: 'block', marginBottom: '7px', marginTop:' 17px', fontSize: '13px', width: '54%' }}>
          CNPJ da empresa vinculada:</label>
        <input
            id="cnpj"
            type="text"
            value={userData.cnpj}
            onChange={(e) => setUserData({...userData, cnpj: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '81%'}}
            required
        />
        </div>
        <div>
        {/* Email */}
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 " style={{ display: 'block', marginBottom: '7px',marginTop:' 17px', fontSize: '13px', width: '24%' }}>
          Email:</label>
        <input
          id="email"
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({...userData, email: e.target.value})}
          className="w-full  p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '81%'}}
          required
        />

        
        </div>
        <div>
        {/* Senha Atual */}
        <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700 " style={{ display: 'block', marginBottom: '7px',marginTop:'17px', fontSize: '13px', width: '32%' }}>
          Senha atual:
        </label>
        <input
          id="senhaAtual"
          type="password"
          placeholder="Obrigátoria para alterar senha e/ou email"

          value={userData.senhaAtual}
          onChange={(e) => setUserData({...userData, senhaAtual: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '81%'}}
          required
        />

        </div>
        <div>
        {/* Nova Senha */}
        <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700 " style={{ display: 'block', marginBottom: '7px',marginTop:' 17px', fontSize: '13px', width: '33%' }}>
          Nova senha:
        </label>
        <input
          id="newpassword"
          type="password"
          placeholder=" Ex: ********"
          value={userData.newpassword}
          onChange={(e) => setUserData({...userData, newpassword: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{height: '30px', width: '81%'}}
          required
        />
        </div>
        <fieldset style ={{marginTop:'200px',  padding: '1.5px', backgroundColor: '#E2E8F0', border: 'none' }}></fieldset>
        <button 
          onClick={handleUpdate}
          disabled={updating}
          style={{marginTop: '15px', height: '35px', width:'85%', backgroundColor: '#22C55E', color: 'white', borderRadius: '5px',border: 'none', fontSize: '16px', fontWeight: 'semi-bold'}}>
            Editar
          </button>
          <button
          onClick={() => navigate('/admin')}
          style={{marginTop: '10px', height: '35px', width:'85%', backgroundColor: '#D9D9D9', color: 'white', borderRadius: '5px',border: 'none', fontSize: '16px', fontWeight: 'semi-bold'}}>
            Voltar</button>
                
        
      </div>
      
     
    )}
  </div>
  );
          }