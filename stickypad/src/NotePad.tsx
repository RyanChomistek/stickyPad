import React, { Component, useState, useEffect, KeyboardEvent } from 'react';
import { NoteComponent } from './Note';
import { Button, IconButton, TextField } from "@mui/material";
import { Add } from '@mui/icons-material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Note, MousePosition, NoteProto, IUser, GetNotesRequest, NotePad, MakeNoteRequest } from "shared/build/src"
import './Note.css';

import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'

const gf = new GiphyFetch('whZ244Uf1SGSXfZldBxMtgqGMyUNBUm4')

export const NotePadComponent = ({user, notePad}:{user: IUser, notePad: NotePad}) => {
  const [notes, setNotes] = useState<Map<number, Note>>(new Map<number, Note>());
  const [mousePos, setMousePos] = useState(new MousePosition(0,0));

  // Handle mouse movement so we can spawn note at the right position
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
  }, [mousePos]);

  const getNotesFromServer = async () => {
    let result = await fetch(
      'http://localhost:5000/getNotes', {
          method: "post",
          body: JSON.stringify(new GetNotesRequest(user, notePad)),
          headers: {
              'Content-Type': 'application/json'
          }
      });
      const responseBody = await result.json();
      const notesFromServer = responseBody as Note[];
      const notes = new Map<number, Note>()
      notesFromServer.forEach(x => {
        if(x._id !== undefined)
          notes.set(x._id, x);
      });
      setNotes(notes);
      
  }

  // Get notes from server 
  useEffect(() => {
    console.log(notePad)
    setNotes(new Map<number, Note>())
    getNotesFromServer();
  }, [notePad]);

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null,
    );
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  var makeNote = async () => {
    closeContextMenu();

    let result = await fetch(
      'http://localhost:5000/AddNote', {
          method: "post",
          body: JSON.stringify(new MakeNoteRequest(user, notePad, mousePos)),
          headers: {
              'Content-Type': 'application/json'
          }
      });

      const responseBody = await result.json();
      console.warn(responseBody);
      const dbNote = responseBody as Note;
      if(dbNote._id !== undefined)
      {
        notes.set(dbNote._id, dbNote);
        setNotes(notes);
        console.log(notes)
      }

      console.warn(responseBody as Note);
  };
  
  var updateNote = async (note: Note) => {
    let result = await fetch(
      'http://localhost:5000/UpdateNote', {
          method: "post",
          body: JSON.stringify(note),
          headers: {
              'Content-Type': 'application/json'
          }
      });

      const responseBody = await result.json();
      console.warn(responseBody);
      const dbNote = responseBody as Note;
      if(dbNote._id !== undefined)
      {
        notes.set(dbNote._id, dbNote);
        setNotes(notes);
        console.log(notes)
      }
  };

  const [stickerSearchTerm, setStickerSearchTerm] = useState<string>("");
  var getStickers = (query: string) => {
    setStickerSearchTerm(query);
  }

  //const search = gf.search("sloth", {type: "stickers"});
  const fetchGifs = (offset: number) => gf.search(stickerSearchTerm, { offset, type: "stickers", limit: 10 })

  return (
    <div className="NotePad" onContextMenu={handleContextMenu}>
      {Array.from(notes.keys()).map((element, index) => {
        const note = notes.get(element);
        if(note !== undefined)
          return NoteComponent(note, index, updateNote);
      })}
      <Menu
        open={contextMenu !== null}
        onClose={closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={makeNote}>Add Note</MenuItem>
        <TextField
          id="outlined-basic"
          label="Rename"
          variant="outlined"
          style={{ margin: 5 }}
          // defaultValue={contextMenuNotePad?.title}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            // if (contextMenuNotePad)
            //   updateNotePad(contextMenuNotePad);
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            // if (contextMenuNotePad)
            //   contextMenuNotePad.title = e.target.value;
            // setContextMenuNotePad(contextMenuNotePad)
            //getStickers(e.target.value);
          }}
          // onKeyDown={closeContextMenuOnSubmit}
        />
        {<Grid width={400} columns={3} gutter={3} fetchGifs={fetchGifs} key={stickerSearchTerm} onGifClick={(gif: IGif) => {console.log(gif)}} noLink/>}
        
      </Menu>
    </div>
  )
}