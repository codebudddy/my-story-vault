import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";

import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";

//configure context.
const AuthContext = createContext(null);
export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      // Authenticate user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      //  fetch additional user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          ...userDoc.data(),
        };
      } else {
        // If no Firestore data exists, return basic auth user data
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };
      }
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  };

  //singup
  const signup = async (email, password, firstName, lastName) => {
    try {
      // Create user with email and password in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user's displayName (optional, for Firebase Auth profile)
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Store additional user data in Firestore users collection
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        createdAt: serverTimestamp(),
      });

      return user;
    } catch (error) {
      throw new Error(`Sign-up failed: ${error.message}`);
    }
  };

  //logout
  const logout = () => signOut(auth);

  //remove white space
  const trimString = (string) => string.trim();

  //Listen for authentication state change

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        console.log("Auth state changed:", {
          uid: currentUser?.uid,
          email: currentUser?.email,
        });
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Auth state error:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loading, setLoading, user, login, trimString, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
