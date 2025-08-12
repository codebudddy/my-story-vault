import React from "react";
import { useParams } from "react-router-dom";

export default function ChapterPage() {
  const { bookId, chapterId } = useParams();
  return (
    <h1>
      Book {bookId} - Chapter {chapterId}
    </h1>
  );
}
