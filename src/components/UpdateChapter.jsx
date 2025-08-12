import React, { useState } from "react";
import { useFirebase } from "../hooks/useFirebaseContext";

export default function UpdateChapter({ currentChapter, onClose }) {
  const [chapterNumber, setChapterNumber] = useState(
    currentChapter.chapterNumber
  );

  const [title, setTitle] = useState(currentChapter.title);
  const [content, setContent] = useState(currentChapter.content);
  const { updateChapter } = useFirebase();
  //Get current
  //handle chapter update

  const handleChapterUpdate = async () => {
    const newChapterDate = {
      title,
      content,
    };

    try {
      const updatedChapter = await updateChapter(
        currentChapter.bookId,
        currentChapter.id,
        newChapterDate
      );
      alert(`Changes to ${updatedChapter.title} Saved`);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="editChapter">
      <div className="editChapterContainer ">
        <div className="editChapterForm inputForm">
          <header className="editChapterHeader">
            Edit Chapter {currentChapter.chapterNumber}
          </header>
          <form>
            <input
              value={chapterNumber}
              type="number"
              onChange={(e) => setChapterNumber(e.target.value)}
            />
            <input
              className="input"
              type="text"
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <textarea
              value={content}
              name="chapterContent"
              placeholder="thoughts?...."
              onChange={(e) => setContent(e.target.value)}
              className="border p-2 rounded w-full flex-1 resize-both"
              style={{
                minHeight: "200px",
              }}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleChapterUpdate()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
