import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import app from "./core";
import { arrayUnion, doc, getDoc, or, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firestore";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";


export const auth = getAuth(app);

interface firebaseError extends Error {
  code: string;
}


export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    const firebaseError = error as firebaseError;
      
    switch(firebaseError.code) {
      case 'auth/invalid-email':
        throw new Error('E-mail inválido');
      case 'auth/user-not-found':
        throw new Error('Usuário não cadastrado');
      case 'auth/wrong-password':
        throw new Error('Senha incorreta');
      default:
        throw new Error('Falha no login: ' + firebaseError.message);
    }
  }
};


export const register = async (email: string, password: string, userData: any, role: string) => {
  try {
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuário autenticado após registro:", auth.currentUser?.uid);
    console.log("UID criado:", userCredential.user.uid)
    const cnpjNumerico = userData.cnpj.replace(/\D/g, '');

    
    if (role === 'empresa') {
      const cnpjDoc = await getDoc(doc(db, "empresas", cnpjNumerico));
      if (cnpjDoc.exists()) throw new Error("CNPJ já cadastrado");

      await setDoc(doc(db, "empresas", cnpjNumerico), {
        name: userData.name,
        cnpj: cnpjNumerico,
        usuarios: [userCredential.user.uid], 
        createdAt: new Date()
      });
    }

    if( role === 'admin' || role === 'funcionario') {
      
        const cnpjNumerico = userData.cnpj.replace(/\D/g, '');
        const empresaRef = doc(db, "empresas", cnpjNumerico);
        const empresaSnap = await getDoc(empresaRef);
      
      
      if (!empresaSnap.exists()) {
        throw new Error("CNPJ não cadastrado como empresa");
      }
      
    
    }



    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: userData.name,
      cnpj: cnpjNumerico,
      email,
      role,
      createdAt: new Date(),
      
    });

    return userCredential;
  } catch (error) {
    console.error("Erro no registro:", error);
    throw error;
  }
};
export const resetPassword = async (email: string) => {
  

  try{
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const firebaseError = error as firebaseError;
    switch(firebaseError.code) {
      case 'auth/user-not-found':
        throw new Error('Usuário não cadastrado');
      case 'auth/invalid-email':
        throw new Error('E-mail inválido');
      default:
        throw new Error('Falha ao redefinir senha: ' + firebaseError.message);
    }
  }
};
