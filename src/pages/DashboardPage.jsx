import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFirebase } from "../hooks/useFirebaseContext";
import EditorModal from "../components/EditorModal.jsx";
import ChapterView from "../components/ChapterView.jsx";
import { IconTrashX } from "@tabler/icons-react";
import ReadChapter from "../components/ReadChapter.jsx";
import { Plus } from "tabler-icons-react";

export default function DashboardPage() {
  const [modalState, setModalState] = useState("closed");
  const [editorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [myBooks, setMyBooks] = useState("");
  const [content, setContent] = useState("");
  const [chapterOpen, setChapterOpen] = useState(false);
  const [chapterData, setChapterData] = useState("");
  const { logout, trimString, user } = useAuthContext();
  const {
    createBook,
    getBooks,
    selectedBook,
    setSelectedBook,
    getChapters,
    chaptersList,
    setChaptersList,
    createChapter,
  } = useFirebase();

  const handleLogout = async () => {
    try {
      setSelectedBook(null);
      setEditorOpen(false);
      await logout();
      alert("This user is logged out");
    } catch (error) {
      console.log(error);
    }
  };

  //Toggle Create book Modal
  const toggleModal = () => {
    if (modalState === "closed") setModalState("open");
    else setModalState("closed");
  };

  //toggle editor

  const toggleEditor = () => {
    if (!editorOpen) {
      setEditorOpen(true);
    } else {
      setEditorOpen(false);
    }

    console.log(editorOpen);
  };

  //Modals
  //Create Book Modal
  const handleBookCreation = async (event) => {
    event.preventDefault();
    if (!title.length) {
      alert("Book title cannot be empty");
      return;
    }

    //create books
    try {
      createBook(trimString(title), user).then((createdBook) =>
        console.log(createdBook)
      );
    } catch (error) {
      console.error(error);
    }
    setTitle("");
    toggleModal();
  };

  //handle selected book
  const handleSelectedBook = async (book) => {
    setSelectedBook(book.id);
    localStorage.setItem(
      "persistData",
      JSON.stringify({ selectedBook: book.id })
    );
    try {
      const chapters = await getChapters(book.id);
      setChaptersList(chapters);
    } catch (error) {
      console.error(error);
    }
  };

  //Handle chapter creation
  const handleCreateChapter = async (newContent) => {
    setContent(newContent);
    try {
      const newBook = await createChapter(selectedBook, newContent);
      console.log(newBook);
    } catch (error) {
      console.error(error);
    }
  };

  //handle chapter opening function
  const handleChapterOpen = (chapter) => {
    setChapterOpen(true);
    setChapterData(chapter);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksList = await getBooks();
        setMyBooks(booksList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBooks();
  }, [getBooks]);

  return (
    <>
      <main className="dashboard">
        <div className="sidebar">
          <header>
            <h1>Books</h1>
          </header>

          <div className="addBooks">
            <button className="add" onClick={toggleModal}>
              New Book
            </button>
          </div>

          {modalState === "open" ? (
            <div className="addBookModal">
              <div className="title">Add book</div>
              <form action="" className="createBook">
                <input
                  className="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <div>
                  <button onClick={toggleModal} className="button cancelButton">
                    Cancel
                  </button>
                  <button
                    className="button submitButton"
                    type="submit"
                    onClick={handleBookCreation}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <></>
          )}

          <div className="book">
            {myBooks &&
              myBooks.map((book) => (
                <div
                  onClick={() => handleSelectedBook(book)}
                  key={book.id}
                  style={
                    book.id === selectedBook
                      ? {
                          paddingLeft: "1rem",
                          // marginBottom: "5px",
                          cursor: "pointer",
                          // backgroundColor: "#e0e0e0",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }
                      : { cursor: "pointer" }
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                    }}
                  >
                    <IconTrashX stroke={2} color="#5763f1" />
                    <p style={{ marginLeft: "5px" }}>{book.name}📕</p>
                  </div>
                </div>
              ))}
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="mainPanel">
          {chaptersList?.length ? (
            <>
              <div className="mainPanelContainer">
                <div>
                  <button onClick={toggleEditor} className="addChapter">
                    New Chapter
                  </button>
                </div>
                {chaptersList.map((chapter) => (
                  <ChapterView
                    onClick={handleChapterOpen}
                    key={chapter.id}
                    prop={chapter}
                  />
                ))}
              </div>
              {chapterOpen && chapterData && (
                <ReadChapter
                  chapterData={chapterData}
                  toggleChapterState={setChapterOpen}
                />
              )}
            </>
          ) : (
            <div>
              {selectedBook && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    padding: " 4px 0",
                  }}
                >
                  <h3>Start Scribbling, Scribe</h3>
                  <button onClick={toggleEditor} className="addChapter">
                    <Plus />
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="addChapterModal modal">
            <EditorModal
              isOpen={editorOpen}
              onClose={() => setEditorOpen(false)}
              onSave={handleCreateChapter}
              initialContent={content}
            />
          </div>
        </div>
      </main>
    </>
  );
}
