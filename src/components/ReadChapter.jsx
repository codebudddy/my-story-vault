import React, { useState } from "react";
import { IconCircleLetterX } from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";
import UpdateChapter from "./UpdateChapter.jsx";

export default function ReadChapter({ chapterData, toggleChapterState }) {
  const [chapterEditOpen, setChapterEditOpen] = useState(false);

  return (
    <div className="readChapterContainer">
      <div className="readChapter">
        <h1 className="chapterNumber">{chapterData?.chapterNumber}</h1>
        <p className="title">{chapterData?.title}</p>

        <pre className="contentPre content">{chapterData?.content}</pre>

        <div className="chapterUtils">
          <button
            className="chapterCloseButton"
            onClick={() => toggleChapterState(false)}
          >
            <IconCircleLetterX stroke={2} />
          </button>
          <button className="chapterEditButton">
            <IconEdit stroke={2} onClick={() => setChapterEditOpen(true)} />
          </button>
        </div>
      </div>

      {chapterEditOpen && (
        <UpdateChapter
          currentChapter={chapterData}
          onClose={() => setChapterEditOpen(false)}
          returnToMainPanel={() => toggleChapterState(false)}
        />
      )}
    </div>
  );
}
