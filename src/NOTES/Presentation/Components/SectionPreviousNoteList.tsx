import NotePreviewList from "./NotePreviewList";

export default function SectionPreviousNoteList() {
    return (
        <section>
            <button type="button">
                + crear nueva nota
            </button>

            <NotePreviewList />
        </section>
    )
}