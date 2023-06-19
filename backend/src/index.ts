import { Schema, model, connect } from 'mongoose';
import { INote, IPosition } from 'shared/build/src'

const NotesSchema = new Schema<INote>({
    title: { type: String, required: false },
    body: { type: String, required: false },
    pos: { x: Number, y:Number },
  });

const Note = model<INote>('notes', NotesSchema);

connect('mongodb://0.0.0.0:27017/Notes');

Note.createIndexes();

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req: any, resp: any) => {
 
    resp.send("App is Working");
    // You can check backend is working or not by
    // entering http://loacalhost:5000
     
    // If you see App is working means
    // backend working properly
});
 
app.post("/getNotes", async (req: any, resp: any) => {
    console.log("/getNotes")
    try {
        const res = await Note.find({}).exec();
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
        const note = new Note(req.body);
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
        console.log(req.body)
        console.log(note?.toObject())
        resp.send(note);

    } catch (e) {
      console.log(e);
      resp.send("Something Went Wrong");
    }
});


app.listen(5000);