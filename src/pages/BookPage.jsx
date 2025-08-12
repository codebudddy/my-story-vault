import React from "react";
import { useParams } from "react-router-dom";

export default function BookPage() {
  const { bookId } = useParams();
  return <h1>Book: {bookId}</h1>;
}
