import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import app from "./core";

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


export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    let errorMessage = "Falha no cadastro";
    
    switch ((error as firebaseError).code) {
      case "auth/email-already-in-use":
        errorMessage = "E-mail já cadastrado";
        break;
      case "auth/invalid-email":
        errorMessage = "E-mail inválido";
        break;
      case "auth/operation-not-allowed":
        errorMessage = "Cadastro por e-mail desabilitado"; 
        break;
      case "auth/weak-password":
        errorMessage = "Senha fraca (mínimo 6 caracteres)";
        break;
    }
    throw new Error(errorMessage);
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


