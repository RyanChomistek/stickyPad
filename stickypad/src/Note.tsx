import React from 'react';
import './Note.css';

export class Note
{
    constructor(
        public title: string,
        public body: string) 
    {
    }
}

export function NoteComponent(note: Note) {
  return (
    <div className="Note">
        <p>{note.title}</p>
        <p>{note.body}</p>
    </div>
  );
}