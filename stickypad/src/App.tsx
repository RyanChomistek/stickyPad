import React, { Component, useState, useEffect } from 'react';
import {NoteBook} from './NoteBook';
import GoogleLoginPage from './Login';
import Draggable from 'react-draggable';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { IUser } from 'shared/build/src';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser>();

  const onLoggedIn = (user: IUser) => {
    setIsLoggedIn(true)
    setUser(user);
  };

  useEffect(() => {
    const user = localStorage.getItem('user') as string;
    if(user != null)
    {
      onLoggedIn(JSON.parse(user) as IUser)
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
        </header>
        <GoogleLoginPage 
          //onLogin={onLoggedIn}
          onLoggedIn={onLoggedIn}
        />
        {user &&
          <NoteBook user={user}/>
        }
      </div>
    </ThemeProvider>
  );
}

export default App;
