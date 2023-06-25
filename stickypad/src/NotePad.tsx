import { Divider, TextField } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react';
import useDebounce from "react-use/lib/useDebounce";
import { GetNotesRequest, ISticker, IUser, MakeNoteRequest, MakeStickerRequest, MousePosition, Note, NotePad, Sticker, GetNotePadDataRequest, GetNotePadDataResponse } from "shared/build/src";
import { NoteComponent, StickerComponent } from './Note';
import './Note.css';

import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Grid, Gif } from '@giphy/react-components';

const gf = new GiphyFetch('whZ244Uf1SGSXfZldBxMtgqGMyUNBUm4')

const NotePadContextMenu = (
  { user, notePad, makeNote, contextMenuPosition, closeContextMenu, OnStickerSelected }:
    {
      user: IUser,
      notePad: NotePad,
      makeNote: () => void,
      contextMenuPosition: MousePosition | null,
      closeContextMenu: () => void,
      OnStickerSelected: (gif: IGif) => void,
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
        onGifClick={(gif: IGif) => {OnStickerSelected(gif)}} 
        noLink 
        noResultsMessage={NoResults}/>

    </Menu>
  );
}

export const NotePadComponent = ({ user, notePad }: { user: IUser, notePad: NotePad }) => {
  const [notes, setNotes] = useState<Map<number, Note|Sticker>>(new Map<number, Note|Sticker>());
  const UpdateItemInNotes = (item: Note|Sticker) => {
    if (item._id !== undefined) {
      notes.set(item._id, item);
      setNotes(notes);
      console.log(notes)
    }
  }


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
    const dbNote = new Note(responseBody as Note);
    UpdateItemInNotes(dbNote);
  };

  const getDataForNotePad = async () => {
    let result = await fetch(
      'http://localhost:5000/getNotePadData', {
      method: "post",
      body: JSON.stringify(new GetNotePadDataRequest(user, notePad)),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const response: GetNotePadDataResponse = await result.json();
    const notesFromServer = (response.notes).map(x => new Note(x));
    const stickersFromServer = (response.stickers).map(x => new Sticker(x));
    const notes = new Map<number, Note|Sticker>()
    notesFromServer.forEach(x => {
      if (x._id !== undefined)
        notes.set(x._id, x);
    });

    stickersFromServer.forEach(x => {
      if (x._id !== undefined)
        notes.set(x._id, x);
    });
    console.log(response)
    setNotes(notes);

  }

  // Get notes from server 
  useEffect(() => {
    console.log(notePad)
    setNotes(new Map<number, Note>())
    getDataForNotePad();
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
    const dbNote = new Note(responseBody as Note);
    UpdateItemInNotes(dbNote);
  };

  var makeSticker = async (gif: IGif) => {
    closeContextMenu();
    let result = await fetch(
      'http://localhost:5000/AddSticker', {
      method: "post",
      body: JSON.stringify(new MakeStickerRequest(user, notePad, mousePos, gif.images.fixed_height.url)),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseBody = await result.json();
    console.warn(responseBody);
    const dbSticker = new Sticker(responseBody as Sticker);
    UpdateItemInNotes(dbSticker);

    console.warn(dbSticker);
  };

  var updateSticker = async (sticker: Sticker) => {
    let result = await fetch(
      'http://localhost:5000/UpdateSticker', {
      method: "post",
      body: JSON.stringify(sticker),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseBody = await result.json();
    console.warn(responseBody);
    const dbSticker = new Sticker(responseBody as Sticker);
    UpdateItemInNotes(dbSticker);
  };

  return (
    <div className="NotePad" onContextMenu={handleContextMenu}>
      <div>
        {Array.from(notes.keys()).map((element, index) => {
          const note = notes.get(element);
          if (note !== undefined)
          {
            if(note instanceof Note)
              return NoteComponent(note, index, updateNote);
            else if(note instanceof Sticker)
              return <StickerComponent sticker={note} index={index} updateSticker={updateSticker} gf={gf}/>
            else
              console.warn(`${note} has bad type`)
          }
              
        })}
      </div>

      <NotePadContextMenu user={user} notePad={notePad} makeNote={makeNote} contextMenuPosition={contextMenu} closeContextMenu={closeContextMenu} OnStickerSelected={makeSticker}/>
    </div>
  )
}