import React, { Component, useState } from 'react';
import {Note, NoteComponent} from './Note';
import './App.css';

const NotePad: React.FC = () => {
  // useState is a generic function,
  // that means that it can accept a type parameter.
  // This type-parameter will tell TypeScript
  // which types are acceptable for this state.
  const [notes, setNotes] = useState<Note[]>([]);
  
  var makeNote = () => {
    //notes.push(new Note("test", "test"));
    setNotes(prevNotes => [...prevNotes, new Note("title", "body")]);
    console.log(notes)
    //setNotes(notes);
  };

  return (
    <>
      <button 
        type="button" 
        // If we try to pass a string 
        // instead of a number we will get an error.
        onClick={() => makeNote()}
      >
        Set another value!
      </button>
      {notes.map((element, index) => {
        return (
          <div key={index}>
            <h2>{element.title}</h2>
            <h2>{element.body}</h2>
          </div>
        );
      })}
    </>

  )
}

function App() {



  return (
    <div className="App">
      <header className="App-header">
        <NotePad/>
      </header>
    </div>
  );
}

export default App;
