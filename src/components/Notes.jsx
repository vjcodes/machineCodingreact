import { createRef, useEffect, useRef } from "react";
import Note from "./Note";

const Notes = ({ notes = [], setNotes = () => {} }) => {
  useEffect(() => {
    //local storage logic
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

    const updatedNotes = notes.map((note) => {
      const savedNote = savedNotes.find((n) => n.id === note.id);
      if (savedNote) {
        return { ...note, position: savedNote.position };
      } else {
        const position = determineNewPosition();
        return { ...note, position };
      }
    });

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }, [notes.length]);

  const notesRef = useRef([]);

  const determineNewPosition = () => {
    const maxX = window.innerWidth - 250;
    const maxY = window.innerHeight - 250;

    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  };

  const handleDragStart = (note, e) => {
    const { id } = note;
    const noteRef = notesRef.current[id].current;
    const rect = noteRef.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const startPos = note.position;

    const handleMouseMove = (e) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      noteRef.style.left = `${newX}px`;
      noteRef.style.top = `${newY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      const finalRect = noteRef.getBoundingClientRect();
      const newPosition = { x: finalRect.left, y: finalRect.top };

      if (checkForOverlap(id)) {
        // check for overlap
        noteRef.style.left = `${startPos.x}px`;
        noteRef.style.top = `${startPos.y}px`;
      } else {
        updateNotePosition(id, newPosition);
      }
    };

    const updateNotePosition = (id, newPosition) => {
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, position: newPosition } : { ...note }
      );

      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    console.log(rect);
  };

  const checkForOverlap = (id) => {
    const currentNoteRef = notesRef.current[id].current;
    const currentRect = currentNoteRef.getBoundingClientRect();

    return notes.some((note) => {
      if (note.id === id) {
        return false;
      }

      const otherNoteRef = notesRef.current[note.id].current;
      const otherRect = otherNoteRef.getBoundingClientRect();

      const overlap = !(
        currentRect.right < otherRect.left ||
        currentRect.left > otherRect.right ||
        currentRect.bottom < otherRect.top ||
        currentRect.top > otherRect.bottom
      );

      return overlap;
    });
  };

  return (
    <div>
      {notes.map((note) => (
        <Note
          ref={
            notesRef.current[note.id]
              ? notesRef.current[note.id]
              : (notesRef.current[note.id] = createRef())
          }
          key={note?.id}
          initialPos={note?.position}
          content={note?.text}
          onMouseDown={(e) => handleDragStart(note, e)}
        />
      ))}
    </div>
  );
};

export default Notes;
