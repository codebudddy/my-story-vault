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
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useAuthContext } from "../hooks/useAuthContext";

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [chaptersList, setChaptersList] = useState(null);
  const { loading, user } = useAuthContext();

  // CRUD functions

  //Create and Fetch Book Titles
  const createBook = async (userId, bookName) => {
    try {
      const bookRef = await addDoc(collection(db, "users", userId, "books"), {
        bookName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return bookRef.id;
    } catch (error) {
      throw new Error(`Failed to add book: ${error.message}`);
    }
  };

  // Get books from a user's books subcollection with real-time updates
  const getBooks = (callback) => {
    if (loading) {
      console.log("getBooks: Auth state is still loading");
      if (typeof callback === "function") {
        callback([]);
      } else {
        console.error(
          "getBooks: callback must be a function, received:",
          callback
        );
      }
      return () => {};
    }
    if (!user || !user.uid) {
      console.log("getBooks: No user logged in");
      if (typeof callback === "function") {
        callback([]);
      } else {
        console.error(
          "getBooks: callback must be a function, received:",
          callback
        );
      }
      return () => {};
    }
    if (typeof callback !== "function") {
      console.error(
        "getBooks: callback must be a function, received:",
        callback
      );
      return () => {};
    }
    try {
      // Sort by createdAt descending (newest first)
      const q = query(
        collection(db, "users", user.uid, "books"),
        orderBy("createdAt", "asc")
      );

      console.log("getBooks: Setting up listener for user:", user.uid);
      return onSnapshot(
        q,
        (snapshot) => {
          const books = [];
          snapshot.forEach((doc) => {
            books.push({ id: doc.id, ...doc.data() });
          });
          console.log("getBooks: Sending books to callback:", books);
          callback(books);
        },
        (error) => {
          console.error("Error fetching books:", error.code, error.message);
          if (typeof callback === "function") {
            callback([]);
          }
        }
      );
    } catch (error) {
      console.error("Error setting up books listener:", error);
      if (typeof callback === "function") {
        callback([]);
      }
      return () => {};
    }
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
