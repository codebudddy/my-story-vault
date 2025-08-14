import React, { createContext, useState } from "react";
import { db } from "../services/firebase";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useAuthContext } from "../hooks/useAuthContext";

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [chaptersList, setChaptersList] = useState([]);
  const { loading, user } = useAuthContext();

  // CRUD functions

  //Create books
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

  const createChapter = async (
    bookId,
    bookName,
    chapterNumber,
    title,
    content
  ) => {
    if (loading) {
      throw new Error("Authentication state is still loading");
    }
    if (!user || !user.uid) {
      throw new Error("No user logged in");
    }
    if (!bookId || !chapterNumber || !content) {
      throw new Error("bookId, chapterNumber, and content are required");
    }
    try {
      // Check for unique chapterNumber
      const chaptersRef = collection(
        db,
        "users",
        user.uid,
        "books",
        bookId,
        "chapters"
      );
      const q = query(chaptersRef, orderBy("chapterNumber"));
      const snapshot = await getDocs(q);
      const existingNumbers = snapshot.docs.map(
        (doc) => doc.data().chapterNumber
      );
      if (existingNumbers.includes(chapterNumber)) {
        throw new Error(
          `Chapter number ${chapterNumber} already exists for this book`
        );
      }

      const chapterRef = await addDoc(chaptersRef, {
        chapterNumber:
          typeof chapterNumber === "string"
            ? chapterNumber
            : chapterNumber.toString(),
        title: title || "",
        content,
        parentId: bookId,
        bookName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("Added chapter:", { bookId, chapterNumber, title });
      return chapterRef.id;
    } catch (error) {
      console.error("Error adding chapter:", error.code, error.message);
      throw new Error(
        `Failed to add chapter: ${error.message} (${error.code})`
      );
    }
  };

  //Fetch Chapters

  // const getChapters = async (bookId) => {
  //   const snapshot = await getDocs(collection(db, `books/${bookId}/chapters`));
  //   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  // };

  const getChapters = (bookId, callback) => {
    if (loading) {
      console.log("getChapters: Auth state is still loading");
      if (typeof callback === "function") {
        callback([]);
      } else {
        console.error(
          "getChapters: callback must be a function, received:",
          callback
        );
      }
      return () => {};
    }
    if (!user || !user.uid) {
      console.log("getChapters: No user logged in");
      if (typeof callback === "function") {
        callback([]);
      } else {
        console.error(
          "getChapters: callback must be a function, received:",
          callback
        );
      }
      return () => {};
    }
    if (!bookId) {
      console.log("getChapters: bookId is required");
      if (typeof callback === "function") {
        callback([]);
      } else {
        console.error(
          "getChapters: callback must be a function, received:",
          callback
        );
      }
      return () => {};
    }
    if (typeof callback !== "function") {
      console.error(
        "getChapters: callback must be a function, received:",
        callback
      );
      return () => {};
    }
    try {
      const q = query(
        collection(db, "users", user.uid, "books", bookId, "chapters"),
        orderBy("chapterNumber", "asc")
      );
      console.log("getChapters: Setting up listener for book:", bookId);
      return onSnapshot(
        q,
        (snapshot) => {
          const chapters = [];
          snapshot.forEach((doc) => {
            chapters.push({ id: doc.id, ...doc.data() });
          });
          console.log("getChapters: Sending chapters to callback:", chapters);
          callback(chapters);
        },
        (error) => {
          console.error("Error fetching chapters:", error.code, error.message);
          if (typeof callback === "function") {
            callback([]);
          }
        }
      );
    } catch (error) {
      console.error("Error setting up chapters listener:", error);
      if (typeof callback === "function") {
        callback([]);
      }
      return () => {};
    }
  };

  const updateChapter = async (
    bookId,
    chapterId,
    chapterNumber,
    title,
    content
  ) => {
    if (loading) {
      throw new Error("Authentication state is still loading");
    }
    if (!user || !user.uid) {
      throw new Error("No user logged in");
    }
    if (!bookId || !chapterId || !chapterNumber || !content) {
      throw new Error(
        "bookId, chapterId, chapterNumber, and content are required"
      );
    }
    try {
      const chaptersRef = collection(
        db,
        "users",
        user.uid,
        "books",
        bookId,
        "chapters"
      );
      const q = query(chaptersRef, orderBy("chapterNumber"));
      const snapshot = await getDocs(q);
      const existingNumbers = snapshot.docs
        .filter((doc) => doc.id !== chapterId) // Exclude current chapter
        .map((doc) => doc.data().chapterNumber);
      if (existingNumbers.includes(chapterNumber)) {
        throw new Error(
          `Chapter number ${chapterNumber} already exists for this book`
        );
      }

      const chapterRef = doc(
        db,
        "users",
        user.uid,
        "books",
        bookId,
        "chapters",
        chapterId
      );
      await updateDoc(chapterRef, {
        chapterNumber:
          typeof chapterNumber === "string"
            ? chapterNumber
            : chapterNumber.toString(),
        title: title || "",
        content,
        updatedAt: serverTimestamp(),
      });
      console.log("Updated chapter:", {
        bookId,
        chapterId,
        chapterNumber,
        title,
        content,
      });
    } catch (error) {
      console.error("Error updating chapter:", error.code, error.message);
      throw new Error(
        `Failed to update chapter: ${error.message} (${error.code})`
      );
    }
  };

  const deleteChapter = async (bookId, chapterId) => {
    if (loading) {
      throw new Error("Authentication state is still loading");
    }
    if (!user || !user.uid) {
      throw new Error("No user logged in");
    }
    if (!bookId || !chapterId) {
      throw new Error("bookId and chapterId are required");
    }
    try {
      const chapterRef = doc(
        db,
        "users",
        user.uid,
        "books",
        bookId,
        "chapters",
        chapterId
      );
      await deleteDoc(chapterRef);
      console.log("Deleted chapter:", { bookId, chapterId });
    } catch (error) {
      console.error("Error deleting chapter:", error.code, error.message);
      throw new Error(
        `Failed to delete chapter: ${error.message} (${error.code})`
      );
    }
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
