import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

//configure context.
const AuthContext = createContext(null);
export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  //login
  const login = (email, password) => {
    signInWithEmailAndPassword(auth, email, password).catch((err) =>
      console.log(err)
    );
  };

  //singup

  const signup = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => console.log(cred))
      .catch((err) => console.log(err));
  };

  //logout

  const logout = () => signOut(auth);

  //remove white space
  const trimString = (string) => string.trim();

  //Listen for authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    );
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, trimString, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
