import { Note_I } from "../../Domain/note";

export interface Note_Body_I {
    id: string,
    idNote: Note_I['id'],
    body: string
}