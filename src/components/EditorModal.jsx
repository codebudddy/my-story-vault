import React, { useState } from "react";
import { useFirebase } from "../hooks/useFirebaseContext";

export default function EditorModal({

  onClose,
  onSave,
  initialContent,
}) {
  const [content, setContent] = useState(initialContent || "");
  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState(null);
  const { selectedBook } = useFirebase();

  const handleSave = () => {
    if (!title || !chapterNumber || !content) {
      alert("All fields are required");
      return;
    }
    const chapterObj = {
      chapterNumber,
      title,
      content,
      bookId: selectedBook,
    };
    onSave(chapterObj);
    onClose(); // Close modal after saving
    setTitle("");
    setChapterNumber(null);
    setContent("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div
        className="bg-white p-4 rounded-lg shadow-lg flex flex-col"
        style={{
          width: "100%",
          maxWidth: "500px", // Expand up to 500px
          minWidth: "300px",
        }}
      >
        <h2 className="text-lg font-bold mb-3">Content Editor</h2>
        <div className="inputForm">
          <input
            type="text"
            name="chapterNumber"
            className="input"
            placeholder="What chapter is this?"
            onChange={(e) => setChapterNumber(e.target.value)}
          />
          <input
            type="text"
            name="chaptertitle"
            className="chapterTitle input"
            placeholder="title here..."
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            name="chapterContent"
            placeholder="thoughts?...."
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 rounded w-full flex-1 resize-both"
            style={{
              minHeight: "200px",
            }}
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
