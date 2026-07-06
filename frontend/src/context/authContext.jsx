import { createContext, useContext, useEffect, useState } from "react";
import { EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "../firebase.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult();
        setUser(firebaseUser);
        setRole(tokenResult.claims.role || "user");
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const cambiarPassword = async (passwordActual, nuevaPassword) => {
      if (!user || !user.email) {
          throw new Error("Usuario no autenticado")
      }
  
      // Reautenticar
      const credential = EmailAuthProvider.credential(user.email, passwordActual)
  
      await reauthenticateWithCredential(user, credential)
  
      // Actualizar contraseña
      await updatePassword(user, nuevaPassword)
  
      return true
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, cambiarPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
