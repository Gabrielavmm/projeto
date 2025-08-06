import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firestore";

export const indicadoresService = {
    async getIndicadores(cnpj: string) {
        const docRef = doc(db, "indicadores", cnpj);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().indicadores : [];
      },

      async saveIndicadores(cnpj: string, indicadores: any[]) {
        await setDoc(doc(db, "indicadores", cnpj), {
          indicadores,
          ultimaAtualizacao: new Date(),
          cnpj
        }, { merge: true });
      },
      async removeIndicador(cnpj: string, novoArray: any[]) {
        await setDoc(doc(db, "indicadores", cnpj), {
          indicadores: novoArray,
          atualizadoEm: new Date()
        }, { merge: true });
      },

      async createIndicadoresDoc(cnpj: string) {
        await setDoc(doc(db, "indicadores", cnpj), {
          indicadores: [],
          cnpj: cnpj,
          criadoEm: new Date()
        });
      },


  async updateIndicadores(cnpj: string, novosIndicadores: any[]) {
    await setDoc(doc(db, "indicadores", cnpj), {
      indicadores: novosIndicadores,
      atualizadoEm: new Date()
    }, { merge: true });
  }
    };