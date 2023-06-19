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

async function updateNoteTitle(note: Note, title: string)
{
  console.log(note)
  // let result = await fetch(
  //   'http://localhost:5000/UpdateNote', {
  //       method: "post",
  //       body: JSON.stringify({_id:note._id, pos:position}),
  //       headers: {
  //           'Content-Type': 'application/json'
  //       }
  //   });
}

async function updateNoteBody(note: Note, body: string)
{
  console.log(note)
  // let result = await fetch(
  //   'http://localhost:5000/UpdateNote', {
  //       method: "post",
  //       body: JSON.stringify({_id:note._id, pos:position}),
  //       headers: {
  //           'Content-Type': 'application/json'
  //       }
  //   });
}

export function NoteComponent(note: Note, index: number) {
  const onStop = (e: DraggableEvent, data: DraggableData) => {
    console.log(e);
    console.log(data);
    updateNotePosition(note, new MousePosition(data.x, data.y));
  }

  return (
    <div style={{position: 'absolute', top: 0}} key={index}>
      <Draggable defaultPosition={note.pos} onStop={onStop}>
        <div className="Note">
            <div className='noteInput'>
              <TextField 
                id="outlined-basic" 
                label="Title" 
                variant="standard"
                onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                  console.log(event)
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  //note.title = e.target.value;
                }}
                value={note.title}
                />
            </div>
            <div className='noteInput'>
              <TextField id="outlined-basic" label="body" variant="standard" multiline={true}/>
            </div>
        </div>
      </Draggable>
    </div>
  );
}