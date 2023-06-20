import React, {useState} from 'react';
import './Note.css';
import Draggable from 'react-draggable';
import { DraggableEvent, DraggableData} from 'react-draggable';
import { TextField } from "@mui/material";
import { Note, MousePosition } from "shared/build/src"

async function updateNotePosition(note: Note, position: MousePosition)
{
  console.log(note)
  let result = await fetch(
    'http://localhost:5000/UpdateNote', {
        method: "post",
        body: JSON.stringify({_id:note._id, pos:position}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function NoteComponent(note: Note, index: number, updateNote:(note:Note)=>void) {
  const onStop = (e: DraggableEvent, data: DraggableData) => {
    console.log(e);
    console.log(data);
    updateNotePosition(note, new MousePosition(note.pos.x + data.x, note.pos.y + data.y));
  }

  return (
    <div style={{position: 'absolute', top: note.pos.y, left: note.pos.x}} key={index}>
      <Draggable onStop={onStop}>
        <div className="Note">
            <div className='noteInput'>
              <TextField 
                id="outlined-basic" 
                label="Title" 
                variant="standard"
                onBlur={(e:React.FocusEvent<HTMLInputElement>) => {
                  note.title = e.target.value;
                  updateNote(note);
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  note.title = e.target.value;
                  updateNote(note);
                }}
                defaultValue={note.title}
                />
            </div>
            <div className='noteInput'>
              <TextField 
                id="outlined-basic" 
                label="body" 
                variant="standard" 
                multiline={true}
                onBlur={(e:React.FocusEvent<HTMLInputElement>) => {
                  note.body = e.target.value;
                  updateNote(note);
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  note.body = e.target.value;
                  updateNote(note);
                }}
                defaultValue={note.body}
              />
            </div>
        </div>
      </Draggable>
    </div>
  );
}