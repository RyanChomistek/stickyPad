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

export enum ObjectType {
    Note,
    Sticker
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
    GetType = () => ObjectType.Note;
}

export interface IPositionable {
    pos: IPosition;
}

export interface INote extends IPositionable {
    title: string;
    body: string;
    userId: number;
    notePadId: string;
}

export class Note implements INote
{
    public _id?: number = undefined;
    public title: string = '';
    public body: string = '';
    public pos: MousePosition = new MousePosition(0,0);
    public userId: number = 0;
    public notePadId: string = '';

    constructor(data: Partial<Note> = {}) {
        Object.assign(this, data)
      }
}

export interface ISticker extends IPositionable {
    imgUrl: string;
    userId: number;
    notePadId: string;
}

export class Sticker implements ISticker
{
    public _id?: number = undefined;
    public imgUrl: string = '';
    public pos: MousePosition = new MousePosition(0,0);
    public userId: number = 0;
    public notePadId: string = '';

    constructor(data: Partial<Sticker> = {}) {
        Object.assign(this, data)
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

export class GetNotesRequest {
    public constructor(public user: IUser, public notepad: INotePad) {

    }
}

export class MakeNoteRequest {
    public constructor(public user: IUser, public notepad: INotePad, public pos: MousePosition) {

    }
}


export class GetStickersRequest {
    public constructor(public user: IUser, public notepad: INotePad) {

    }
}

export class MakeStickerRequest {
    public constructor(public user: IUser, public notepad: INotePad, public pos: MousePosition, public imgUrl:string) {

    }
}

export class GetNotePadDataRequest {
    public constructor(public user: IUser, public notepad: INotePad) {

    }
}

export class GetNotePadDataResponse {
    public constructor(public stickers: ISticker[], public notes: INote[])  {

    }
}

