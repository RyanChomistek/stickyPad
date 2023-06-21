import React, { Component, useState, useEffect } from 'react';
import { NotePadComponent } from './NotePad';
import { IUser, GetNotePadsRequest, INotePad, MakeNotePadsRequest, NotePad, INote } from 'shared/build/src';
import { Button, IconButton, Tabs, Tab, Menu, MenuItem, TextField, Drawer, List, ListItem, ListItemText, Box, ListItemButton, Divider, SwipeableDrawer, ListItemIcon } from "@mui/material";
import { Add, KeyboardArrowLeftRounded, ChevronRightRounded } from '@mui/icons-material';
export const NoteBook = ({ user }: { user: IUser }) => {
  const [selectedNotePad, setSelectedNotePad] = useState<number>(0);
  const [notePads, setNotePads] = useState<INotePad[]>([]);
  const [isNotePadDrawerOpen, setIsNotePadDrawerOpen] = useState(true);

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
    notePad = responseBody as INotePad;
    notePads[notePads.findIndex(x => x._id === notePad._id)] = notePad;
    setNotePads([...notePads]);
  }

  const deleteNotePad = (notePad?: INotePad) => {
    if (!notePad)
      return;

    fetch(
      'http://localhost:5000/DeleteNotePad', {
      method: "post",
      body: JSON.stringify(notePad),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setNotePads(notePads.filter(x => x._id !== notePad._id))
  };

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

  const closeContextMenuOnSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Enter") {
      if (contextMenuNotePad)
        updateNotePad(contextMenuNotePad);

      closeContextMenu();
    }
  }

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      // onClick={() => setIsNotePadDrawerOpen(false)}
      // onKeyDown={() => setIsNotePadDrawerOpen(false)}
    >
      <List>
        <ListItem key={-1} disablePadding>
          <ListItemButton>
            <ListItemText primary="+ Create New Notepad" onClick={() => makeNotePad()} />
          </ListItemButton>
        </ListItem>

        <Divider />

        {notePads.map((element, index) => (
          <ListItem key={index} disablePadding onContextMenu={e => handleContextMenu(e, element)}>
            <ListItemButton onClick={() => setSelectedNotePad(index)}>
              {index == selectedNotePad &&
                <ListItemIcon>
                  <ChevronRightRounded />
                </ListItemIcon>
              }
              <ListItemText inset={index != selectedNotePad} primary={element.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
          style={{ margin: 5 }}
          defaultValue={contextMenuNotePad?.title}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            // note.title = e.target.value;
            // updateNote(note);
            if (contextMenuNotePad)
              updateNotePad(contextMenuNotePad);
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {

            if (contextMenuNotePad)
              contextMenuNotePad.title = e.target.value;
            setContextMenuNotePad(contextMenuNotePad)
            // updateNote(note);
          }}
          onKeyDown={closeContextMenuOnSubmit}
        />
        <MenuItem
          onClick={() => { deleteNotePad(contextMenuNotePad); closeContextMenu() }}
        >
          Delete {contextMenuNotePad?.title}
        </MenuItem>

      </Menu>
    </Box>
  );

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <IconButton onClick={() => setIsNotePadDrawerOpen(true)} style={{ marginLeft: "auto" }}>
          <KeyboardArrowLeftRounded />
        </IconButton>
      </div>
      <SwipeableDrawer
        open={isNotePadDrawerOpen}
        onClose={() => setIsNotePadDrawerOpen(false)}
        onOpen={() => setIsNotePadDrawerOpen(true)}
        anchor="right"
      >
        {list()}
      </SwipeableDrawer>
      {notePads.length > 0 &&
        <NotePadComponent user={user} notePad={notePads[selectedNotePad]} />}
    </div>

  );
}