import React, { createContext, useState } from "react";
import { db } from "../firebaseConfig";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [chaptersList, setChaptersList] = useState(null);

  // CRUD functions

  //Create and Fetch Book Titles
  const createBook = async (bookName, user) => {
    const bookRef = await addDoc(collection(db, "books"), {
      name: bookName,
      owner: user.uid,
      createdAt: serverTimestamp(),
    }).catch((err) => console.log(err));
    return bookRef;
  };

  const getBooks = async () => {
    const snapshot = await getDocs(collection(db, "books"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const createChapter = async (bookId, chapterData) => {
    return await addDoc(
      collection(db, `books/${bookId}/chapters`),
      chapterData
    );
  };

  const updateChapter = async (bookId, chapterId, updatedData) => {
    await updateDoc(
      doc(db, `books/${bookId}/chapters/${chapterId}`),
      updatedData
    );

    // Now fetch the updated chapter
    const updatedSnap = await getDoc(
      doc(db, `books/${bookId}/chapters/${chapterId}`)
    );
    return { id: updatedSnap.id, ...updatedSnap.data() };
  };

  const deleteChapter = async (bookId, chapterId) => {
    return await deleteDoc(doc(db, `books/${bookId}/chapters/${chapterId}`));
  };

  const getChapters = async (bookId) => {
    const snapshot = await getDocs(collection(db, `books/${bookId}/chapters`));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  return (
    <FirebaseContext.Provider
      value={{
        createBook,

        createChapter,
        updateChapter,
        deleteChapter,
        getBooks,
        getChapters,
        selectedBook,
        setSelectedBook,
        chaptersList,
        setChaptersList,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export { FirebaseContext };
