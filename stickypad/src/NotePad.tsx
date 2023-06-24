import React, { Component, useState, useEffect, KeyboardEvent } from 'react';
import { NoteComponent } from './Note';
import { Button, IconButton, TextField, Divider } from "@mui/material";
import { Add } from '@mui/icons-material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Note, MousePosition, NoteProto, IUser, GetNotesRequest, NotePad, MakeNoteRequest } from "shared/build/src"
import './Note.css';
import useDebounce from "react-use/lib/useDebounce";
import FocusTrap from '@mui/base/FocusTrap';

import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'

const gf = new GiphyFetch('whZ244Uf1SGSXfZldBxMtgqGMyUNBUm4')

const NotePadContextMenu = (
  { user, notePad, makeNote, contextMenuPosition, closeContextMenu }:
    {
      user: IUser,
      notePad: NotePad,
      makeNote: () => void,
      contextMenuPosition: MousePosition | null,
      closeContextMenu: () => void,
    }) => {


  var handleMakeNoteButtonClicked = () => {
    makeNote();
  }

  const [stickerSearchTerm, setStickerSearchTerm] = useState<string>("");
  const [debouncedInput, setDebouncedInput] = useState<string>("");
  useDebounce(() => setStickerSearchTerm(debouncedInput), 500, [debouncedInput]);

  var getStickers = (query: string) => {
    setDebouncedInput(query);
  }

  const fetchGifs = (offset: number) => gf.search(stickerSearchTerm, { offset, type: "stickers", limit: 10 })
  const NoResults = <div className="no-results">No Results for {stickerSearchTerm}</div>;

  return (
    <Menu
      open={contextMenuPosition !== null}
      onClose={closeContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenuPosition !== null
          ? { top: contextMenuPosition.y, left: contextMenuPosition.x }
          : undefined
      }
      variant='menu'
    >
      <MenuItem onClick={makeNote}>Add Note</MenuItem>
      <Divider />
      <TextField
        id="outlined-basic"
        label="Stickers"
        variant="outlined"
        style={{ margin: 5 }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          getStickers(e.target.value);
          console.log(e.target.value)
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          // for whatever reason we need to toss tehy keydown event here or else it might switch focus randomly
          e.stopPropagation();
        }}
      />

      <Grid 
        width={400} 
        columns={3} gutter={3} 
        fetchGifs={fetchGifs} 
        key={stickerSearchTerm} 
        onGifClick={(gif: IGif) => {console.log(gif)}} 
        noLink 
        noResultsMessage={NoResults}/>

    </Menu>
  );
}

export const NotePadComponent = ({ user, notePad }: { user: IUser, notePad: NotePad }) => {
  const [notes, setNotes] = useState<Map<number, Note>>(new Map<number, Note>());

  const [mousePos, setMousePos] = useState(new MousePosition(0, 0));
  const [contextMenu, setContextMenu] = React.useState<MousePosition | null>(null);
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? new MousePosition(event.clientX + 2, event.clientY - 6)
        : null,
    );
  };
  const closeContextMenu = () => {
    setContextMenu(null);
  };

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
    if (dbNote._id !== undefined) {
      notes.set(dbNote._id, dbNote);
      setNotes(notes);
      console.log(notes)
    }

    console.warn(responseBody as Note);
  };

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
      if (x._id !== undefined)
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
    if (dbNote._id !== undefined) {
      notes.set(dbNote._id, dbNote);
      setNotes(notes);
      console.log(notes)
    }
  };

  return (
    <div className="NotePad" onContextMenu={handleContextMenu}>
      <div>
        {Array.from(notes.keys()).map((element, index) => {
          const note = notes.get(element);
          if (note !== undefined)
            return NoteComponent(note, index, updateNote);
        })}
      </div>

      <NotePadContextMenu user={user} notePad={notePad} makeNote={makeNote} contextMenuPosition={contextMenu} closeContextMenu={closeContextMenu} />
    </div>
  )
}