import React, {useState, useEffect} from 'react';
import './Note.css';
import Draggable from 'react-draggable';
import { DraggableEvent, DraggableData} from 'react-draggable';
import { TextField } from "@mui/material";
import { Note, MousePosition, Sticker, IPositionable } from "shared/build/src"
import { Grid, Gif } from '@giphy/react-components';
import { IGif } from '@giphy/js-types';
import { GiphyFetch } from '@giphy/js-fetch-api';

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

async function updateStickerPosition(sticker: Sticker, position: MousePosition)
{
  console.log(sticker)
  let result = await fetch(
    'http://localhost:5000/UpdateSticker', {
        method: "post",
        body: JSON.stringify({_id:sticker._id, pos:position}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function StickerComponent({sticker, index, updateSticker, gf}:
  {sticker: Sticker, index: number, updateSticker:(sticker:Sticker)=>void, gf: GiphyFetch}) {
  const onStop = (e: DraggableEvent, data: DraggableData) => {
    updateStickerPosition(sticker, new MousePosition(sticker.pos.x + data.x, sticker.pos.y + data.y));
  }

  return (
    <div style={{position: 'absolute', top: sticker.pos.y, left: sticker.pos.x}} key={index}>
      <Draggable onStop={onStop}>
        <div className="Sticker" onMouseDown={(e)=>{e.stopPropagation()}}>
          {<img src={sticker.imgUrl} width={200} onMouseDown={(e)=>{e.preventDefault()}}/>}
        </div>
      </Draggable>
    </div>
  );
}