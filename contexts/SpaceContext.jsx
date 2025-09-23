import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const SpaceContext = createContext();

export function SpaceProvider({ children }) {
  const [spaces, setSpaces] = useState([]);

  // Fetch all spaces
  const fetchSpaces = async () => {
    const snapshot = await getDocs(collection(db, "spaces"));
    setSpaces(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Add space
  const addSpace = async (text) => {
    if (!text) return;
    await addDoc(collection(db, "spaces"), { space: text });
    fetchSpaces();
  };

  // Update space
  const updateSpace = async (id, newText) => {
    await updateDoc(doc(db, "spaces", id), { space: newText });
    fetchSpaces();
  };

  // Delete space
  const deleteSpace = async (id) => {
    await deleteDoc(doc(db, "spaces", id));
    fetchSpaces();
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  return (
    <SpaceContext.Provider value={{ spaces, addSpace, updateSpace, deleteSpace }}>
      {children}
    </SpaceContext.Provider>
  );
}

// Hook for easy access
export const useSpaceContext = () => useContext(SpaceContext);
