import { useState } from "react";
import NoteDetails from "./NoteDetails";
import NoteContent from "./NoteContent";
import NoteActions from "./NoteActions";

export default function NoteContainer() {

    const [idNoteLocal, setIDNoteLocal] = useState<string | null>(null);

    const [bodyLocal, setBodyLocal] = useState<string>('');
    const [bodyFromCall, setBodyFromCall] = useState<string>('');

    const [logosFromNoteLocal, setLogosFromNoteLocal] = useState<
        null | {
            modificationDate: null | string,
            isFav: boolean,
            isNotCompleted: boolean,
            isCompleted: boolean,
            isFixed: boolean,
            isArchived: boolean,
        }>(null);

    return (
        <section>
            <NoteDetails
                idNoteLocal={idNoteLocal}
                setIDNoteLocal={setIDNoteLocal}
                setLogosFromNoteLocal={setLogosFromNoteLocal}
            />
            <hr />
            <NoteContent
                idNoteLocal={idNoteLocal}
                bodyLocal={bodyLocal}
                setBodyLocal={setBodyLocal}
                setBodyFromCall={setBodyFromCall}
            />
            <hr />
            <NoteActions
                bodyFromCall={bodyFromCall}
                bodyLocal={bodyLocal}
                logosFromNoteLocal={logosFromNoteLocal}
                idNoteLocal={idNoteLocal}
            />
        </section>
    )
}