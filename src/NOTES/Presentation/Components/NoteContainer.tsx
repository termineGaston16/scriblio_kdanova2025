import { useState } from "react";
import NoteDetails from "./NoteDetails";
import NoteContent from "./NoteContent";

export default function NoteContainer() {

    const [idNoteLocal, setIDNoteLocal] = useState<string | null>(null);
    const [bodyLocal, setBodyLocal] = useState<string>('');

    return (
        <section>
            <NoteDetails
                idNoteLocal={idNoteLocal}
                setIDNoteLocal={setIDNoteLocal}
            />
            <hr />
            <NoteContent
                idNoteLocal={idNoteLocal}
                bodyLocal={bodyLocal}
                setBodyLocal={setBodyLocal}
            />
        </section>
    )
}