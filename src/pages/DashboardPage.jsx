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
  const [myBooks, setMyBooks] = useState([]);
  const [content, setContent] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [chapterOpen, setChapterOpen] = useState(false);
  const [chapterData, setChapterData] = useState("");
  const { logout, trimString, user, loading } = useAuthContext();
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
    setSelectedBook(null);
    setSelectedBookId(null);
    setChaptersList([]);
    setEditorOpen(false);

    try {
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
    setEditorOpen((prev) => !prev);
  };

  //Create Book Modal
  const handleBookCreation = async (event) => {
    event.preventDefault();
    if (!title) {
      alert("Book title cannot be empty");
      return;
    }

    //create books
    try {
      const createdBook = await createBook(user.uid, trimString(title));
      console.log(createdBook);
    } catch (error) {
      console.error(error);
    }
    setTitle("");
    toggleModal();
  };

  //handle selected book
  const handleSelectedBook = async (book) => {
    setSelectedBook(book);
    setSelectedBookId(book.id);
    console.log(chaptersList);
  };

  //Handle chapter creation
  const handleCreateChapter = async (newContent) => {
    setContent(newContent);
    try {
      const newBook = await createChapter(
        selectedBook.id,
        selectedBook.bookName,
        newContent.chapterNumber,
        newContent.title,
        newContent.content
      );
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
    if (loading || !user) {
      setMyBooks([]);
      return;
    }
    const unsubscribe = getBooks((myBooks) => {
      setMyBooks(myBooks);
    });
    return () => unsubscribe();
  }, [user, loading, getBooks]);

  useEffect(() => {
    if (loading || !user || !selectedBookId) {
      if (selectedBookId) {
        setChaptersList([]);
      }
      return;
    }

    const unsubscribeChapters = getChapters(selectedBookId, (chapters) => {
      setChaptersList(chapters);
    });
    return () => unsubscribeChapters();
  }, [selectedBookId]);

  return (
    <>
      <main className="dashboard">
        <div className="sidebar">
          <header>
            <h1>Welcome {user.displayName}</h1>
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

          <div className="books">
            {myBooks &&
              myBooks.map((book) => (
                <div
                  onClick={() => handleSelectedBook(book)}
                  key={book.id}
                  style={
                    book.id === selectedBook?.id
                      ? {
                          paddingLeft: "1rem",
                          // marginBottom: "5px",
                          cursor: "pointer",
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
                    className="book"
                  >
                    <IconTrashX stroke={2} color="#5763f1" />
                    <p style={{ marginLeft: "5px" }}>{book.bookName}📕</p>
                  </div>
                </div>
              ))}
          </div>
          <div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="mainPanel">
          {chaptersList.length > 0 && (
            <>
              <div className="mainPanelContainer">
                <div>
                  <button onClick={toggleEditor} className="addChapter">
                    <Plus size={50} />
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
          )}

          {!selectedBook && (
            <div className="hint">
              <p>To view chapters, select a book</p>
            </div>
          )}

          {selectedBook && !chaptersList?.length && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: " 4px 0",
              }}
            >
              <h3>Add your first chapter</h3>
              <button onClick={toggleEditor} className="addChapter">
                <Plus size={50} />
              </button>
            </div>
          )}

          {editorOpen && (
            <div className="addChapterModal modal">
              <EditorModal
                isOpen={editorOpen}
                onClose={() => setEditorOpen(false)}
                onSave={handleCreateChapter}
                initialContent={content}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
