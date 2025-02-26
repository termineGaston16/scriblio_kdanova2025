import { useState } from "react";
import { useCreateNewNote } from "../Hooks/useCreateNewNote";
import NotePreviewList from "./NotePreviewList";
import FormToCreateNewNote from "./FormToCreateNewNote";
import { Toaster } from "sonner";

export default function SectionPreviousNoteList() {

    const [showFormToCreateNewNote, setShowFormToCreateNewNote] = useState<boolean>(false);

    return (
        <section>
            <button
                onClick={() => setShowFormToCreateNewNote(true)}
                type="button">
                + agregar nueva nota
            </button>

            <NotePreviewList />
            {
                showFormToCreateNewNote &&
                <FormToCreateNewNote
                    closeForm={() => setShowFormToCreateNewNote(false)}
                />
            }

            <Toaster position="bottom-right" />
        </section>
    )
}