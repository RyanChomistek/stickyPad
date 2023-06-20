import React, { Component, useState, useEffect } from 'react';
import { NotePadComponent } from './NotePad';
import { IUser, GetNotePadsRequest,INotePad, MakeNotePadsRequest, NotePad } from 'shared/build/src';
import { Button, IconButton, Tabs, Tab , Menu, MenuItem, TextField} from "@mui/material";
import { Add } from '@mui/icons-material';

export const NoteBook = ({ user }: { user: IUser }) => {
  const [selectedNotePad, setSelectedNotePad] = useState<number>(0);
  const [notePads, setNotePads] = useState<INotePad[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let result = await fetch(
        'http://localhost:5000/getNotePads', {
        method: "post",
        body: JSON.stringify(new GetNotePadsRequest(user)),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseBody = await result.json();
      const notesFromServer = responseBody as INotePad[];
      setNotePads(notesFromServer);
    }

    fetchData();

  }, []);

  const makeNotePad = async () => {
    let result = await fetch(
      'http://localhost:5000/makeNotePad', {
      method: "post",
      body: JSON.stringify(new MakeNotePadsRequest(user)),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseBody = await result.json();
    setNotePads((previousNotePads) => [...previousNotePads, responseBody as NotePad]);
    setSelectedNotePad(notePads.length);
    console.log(responseBody as NotePad)
  }

  const updateNotePad = async (notePad: INotePad) => {
    console.log(notePad)
    let result = await fetch(
      'http://localhost:5000/UpdateNotePad', {
      method: "post",
      body: JSON.stringify(notePad),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseBody = await result.json();
    console.log(responseBody)
    notePad = responseBody as INotePad;
    notePads[notePads.findIndex(x => x._id === notePad._id)] = notePad;
  }

  const onTabSelect = (event: React.SyntheticEvent<Element, Event>, value: any) => {
    console.log(value);
    setSelectedNotePad(value);
  }

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [contextMenuNotePad, setContextMenuNotePad] = useState<INotePad>();

  const handleContextMenu = (event: React.MouseEvent, notePad: INotePad) => {
    event.preventDefault();
    setContextMenuNotePad(notePad);
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

  return (
    <div>
      <div style={{flexDirection:'row', display:'flex'}}>
        <Tabs
          value={selectedNotePad}
          onChange={onTabSelect}
          
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example"
          style= {{flexShrink:1}}
        >
          {notePads.map((element, index) => {
            return (<Tab label={element.title} onContextMenu={e => handleContextMenu(e, element)}/>);
          })}
        </Tabs>
        <IconButton
          onClick={() => makeNotePad()}
          >
          <Add/>
        </IconButton>
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
          <TextField 
            id="outlined-basic" 
            label="Rename" 
            variant="outlined"
            style={{margin:5}}
            onBlur={(e:React.FocusEvent<HTMLInputElement>) => {
              // note.title = e.target.value;
              // updateNote(note);
              if(contextMenuNotePad)
                updateNotePad(contextMenuNotePad);
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if(contextMenuNotePad)
                contextMenuNotePad.title = e.target.value;
                setContextMenuNotePad(contextMenuNotePad)
              // updateNote(note);
            }}
            //defaultValue={contextMenuNotePad?.title}
          />
          <MenuItem >Delete {contextMenuNotePad?.title}</MenuItem>

        </Menu>
      </div>
      {notePads.length > 0 &&
        <NotePadComponent user={user} notePad={notePads[selectedNotePad]}/>}
      
    </div>

  );
}