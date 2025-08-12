import { useContext } from "react";
import { FirebaseContext } from "../context/FirebaseContext.jsx";

export const useFirebase = () => useContext(FirebaseContext);
