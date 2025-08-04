
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../auth';
import { db } from '../firestore';

export interface UserData {
  role: 'admin' | 'empresa' | 'funcionario';
  
}

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error("Perfil de usuário não encontrado");
    }

    return {
      user: userCredential.user,
      userData: userDoc.data() as UserData
    };
  } catch (error) {
    throw error;
  }
};

export const handleFirebaseError = (error: FirebaseError) => {
  const errorMessage = error.message.toLowerCase();
  if (errorMessage.includes('invalid-credential')) {
    return 'Usuário e/ou senha inválidos';
  }
  return 'Erro ao fazer login: ' + error.message;
};