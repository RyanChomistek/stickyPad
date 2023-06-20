import { Schema, model, connect } from 'mongoose';
import { INote, INotePad, IPosition, GetNotesRequest, GetNotePadsRequest, MakeNotePadsRequest, MakeNoteRequest } from 'shared/build/src'

const NotesSchema = new Schema<INote>({
  title: { type: String, required: false },
  body: { type: String, required: false },
  pos: { x: Number, y:Number },
  userId: { type: Number, required: true},
  notePadId: { type: String, required: true}
});

const NotePadsSchema = new Schema<INotePad>({
  owners: { type: [Number], required: true},
  title: { type: String, required: true},
});

const Note = model<INote>('notes', NotesSchema);
const NotePad = model<INotePad>('notePads', NotePadsSchema);

connect('mongodb://0.0.0.0:27017/Notes');

Note.createIndexes();

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
 
app.post("/getNotePads", async (req: any, resp: any) => {
  console.log("/getNotePads")
  try {
      const request = req.body as GetNotePadsRequest
      console.log(req.body)
      const res = await NotePad.find({owners:request.user.id}).exec();
      console.log(`found ${res.length} notePads`)
      resp.send(res);
  } catch (e) {
    console.log(e);
    resp.send("Something Went Wrong");
  }
});

app.post("/makeNotePad", async (req: any, resp: any) => {
  console.log("/makeNotePad")
  try {
      const request = req.body as MakeNotePadsRequest
      const notePad = new NotePad({owners:[request.user.id], title:"New Pad"});
      let result = await notePad.save();
      result = result.toObject();
      console.log(`new notepad ${JSON.stringify(result)}`);
      resp.send(result);
  } catch (e) {
    console.log(e);
    resp.send("Something Went Wrong");
  }
});

app.post("/UpdateNotePad", async (req: any, resp: any) => {
  try {
      console.log("/UpdateNotePad")
      let notePad = await NotePad.findOneAndUpdate({_id:req.body._id}, req.body);
      
      console.log(notePad?.toObject())
      console.log(req.body)
      
      resp.send(req.body);

  } catch (e) {
    console.log(e);
    resp.send("Something Went Wrong");
  }
});

app.post("/getNotes", async (req: any, resp: any) => {
    console.log("/getNotes")
    try {
        const request = req.body as GetNotesRequest
        console.log(req.body)
        const res = await Note.find({notePadId:request.notepad._id}).exec();
        console.log(`found ${res.length} notes`)
        resp.send(res);
    } catch (e) {
      console.log(e);
      resp.send("Something Went Wrong");
    }
});

app.post("/AddNote", async (req: any, resp: any) => {
    try {
        console.log("/AddNote")
        console.log(`0 ${JSON.stringify(req.body)}`);
        const request = req.body as MakeNoteRequest
        const note = new Note({pos:request.pos, userId:request.user.id, notePadId:request.notepad._id});
        let result = await note.save();
        result = result.toObject();

        console.log(`1 ${JSON.stringify(result)}`);

        resp.send(result);
 
    } catch (e) {
      console.log(e);
      resp.send("Something Went Wrong");
    }
});

app.post("/UpdateNote", async (req: any, resp: any) => {
    try {
        let note = await Note.findOneAndUpdate({_id:req.body._id}, req.body);
        console.log("/UpdateNote")
        console.log(note?.toObject())
        console.log(req.body)
        
        resp.send(req.body);

    } catch (e) {
      console.log(e);
      resp.send("Something Went Wrong");
    }
});


app.listen(5000);