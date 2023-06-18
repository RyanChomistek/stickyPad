import React, { Component, useState } from 'react';
import {NotePad} from './NotePad';
import Draggable from 'react-draggable';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
        </header>
        <div>
          <NotePad/>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
