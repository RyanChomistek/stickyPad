export interface IPosition {
    x: number;
    y: number;
}

export interface INote {
    title: string;
    body: string;
    pos: IPosition;
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
        public pos: MousePosition) 
    {
    }
}

export class Note implements INote
{
    public _id?: number = undefined;

    constructor(
        public title: string,
        public body: string,
        public pos: MousePosition) 
    {
    }
}