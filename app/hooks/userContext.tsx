import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
  currentUser: User | null;
  setCurrentUser: (u: User) => void;
  logout: () => void;
}>({
  currentUser: null,
  setCurrentUser: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // load from AsyncStorage if needed
  }, []);

  const logout = () => {
    setCurrentUser(null);
    // Storage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
