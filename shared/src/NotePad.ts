export interface IPosition {
    x: number;
    y: number;
}

export interface IUser
{
    id: number
}

export interface INotePad
{
    owners: number[];
    title: string;
    _id: string;
}

export class NotePad implements INotePad {
    public _id: string = "";

    public constructor(
        public owners: number[],
        public title: string)
    {

    }
}

export class MousePosition implements IPosition {
    public constructor(public x: number, public y:number)
    {}
  }

export class NoteProto implements INote
{
    constructor(
        public title: string,
        public body: string,
        public pos: MousePosition,
        public userId: number,
        public notePadId: string) 
    {
    }
}

export interface INote {
    title: string;
    body: string;
    pos: IPosition;
    userId: number;
    notePadId: string;
}

export class Note implements INote
{
    public _id?: number = undefined;

    constructor(
        public title: string,
        public body: string,
        public pos: MousePosition,
        public userId: number,
        public notePadId: string,
        ) 
    {
    }
}

export class GetNotesRequest {
    public constructor(public user: IUser, public notepad: INotePad) {

    }
}

export class GetNotePadsRequest {
    public constructor(public user: IUser) {

    }
}

export class MakeNotePadsRequest {
    public constructor(public user: IUser) {

    }
}

export class MakeNoteRequest {
    public constructor(public user: IUser, public notepad: INotePad, public pos: MousePosition) {

    }
}

