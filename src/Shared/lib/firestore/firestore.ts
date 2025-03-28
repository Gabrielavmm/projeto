import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "./core";

// Inicialização do Firestore
export const db = getFirestore(app);

// Tipagem para o erro do Firebase
interface FirebaseError extends Error {
  message: string;
}

// Operação de adição de dados
export const addData = async (collectionName: string, data: object) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    throw new Error(`Erro ao adicionar documento: ${firebaseError.message}`);
  }
};