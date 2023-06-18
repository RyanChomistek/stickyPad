import React, { Component, useState, useEffect, KeyboardEvent } from 'react';
import { Note, NoteComponent, MousePosition } from './Note';
import { Button, IconButton } from "@mui/material";
import { Add } from '@mui/icons-material';
import './Note.css';

export const NotePad: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [mousePos, setMousePos] = useState(new MousePosition(0,0));

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePos(new MousePosition(event.clientX, event.clientY));
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, []);

  var makeNote = () => {
    setNotes(prevNotes => [...prevNotes, new Note("title", "body", mousePos)]);
  };

  return (
    <div className="NotePad" tabIndex={0}>
      <IconButton
        onClick={() => makeNote()}>
        <Add/>
      </IconButton>
      {notes.map((element, index) => {
        return NoteComponent(element, index);
      })}

    </div>
  )
}