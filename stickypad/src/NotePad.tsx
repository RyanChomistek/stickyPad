import React, { Component, useState, useEffect, KeyboardEvent } from 'react';
import { Note, NoteComponent, MousePosition } from './Note';
import { Button, IconButton } from "@mui/material";
import { Add } from '@mui/icons-material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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

  var makeNote = () => {
    setNotes(prevNotes => [...prevNotes, new Note("title", "body", mousePos)]);
    closeContextMenu();
  };
  
  return (
    <div className="NotePad" onContextMenu={handleContextMenu}>
      <IconButton
        onClick={() => makeNote()}>
        <Add/>
      </IconButton>
      {notes.map((element, index) => {
        return NoteComponent(element, index);
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
      </Menu>
    </div>
  )
}