import React from 'react';
import './Note.css';
import Draggable from 'react-draggable';
import { TextField } from "@mui/material";
import {ControlPosition} from 'react-draggable';

export class MousePosition implements ControlPosition {
  public constructor(public x: number, public y:number)
  {}
}

export class Note
{
    constructor(
        public title: string,
        public body: string,
        public pos: MousePosition) 
    {
    }
}

export function NoteComponent(note: Note, index: number) {
  return (
    <div style={{position: 'absolute', top: 0}} key={index}>
      <Draggable defaultPosition={note.pos}>
        <div className="Note">
            <div className='noteInput'>
              <TextField id="outlined-basic" label="Title" variant="standard"/>
            </div>
            <div className='noteInput'>
              <TextField id="outlined-basic" label="body" variant="standard" multiline={true}/>
            </div>
        </div>
      </Draggable>
    </div>
  );
}