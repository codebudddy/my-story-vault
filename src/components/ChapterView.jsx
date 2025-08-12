import React from "react";
import { IconTrashX } from "@tabler/icons-react";
import { useFirebase } from "../hooks/useFirebaseContext";

export default function ChapterView({ prop, onClick }) {
  const substringify = (string, length) => string.substring(0, length);
  const { deleteChapter, } = useFirebase();

  const handleChapterDelete = async () => {
    if (window.confirm("Delete Chapter?")) {
      try {
        const deletedChapter = await deleteChapter(prop.bookId, prop.id);
        console.log(`${deletedChapter} has been deleted`);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Delete cancelled");
    }
  };
  return (
    <div className="chapterCardContainer">
      <div className="chapterCard">
        <h3 className="number">{prop.chapterNumber}</h3>
        <h1 className="title">{substringify(prop.title, 20)}</h1>
        <p className="preview" onClick={() => onClick(prop)}>
          {substringify(prop.content, 20)}...
        </p>
        <div className="delete" onClick={handleChapterDelete}>
          <button className="deleteButton">
            <IconTrashX stroke={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
