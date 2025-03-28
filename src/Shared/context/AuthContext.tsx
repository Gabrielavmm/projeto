import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../lib/firestore/auth';

type AuthContextType = {
  user: User | null;
  isAuthLoading: boolean;  
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthLoading }}>
      {!isAuthLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);