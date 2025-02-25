import NotePreviewList from "./NotePreviewList";

export default function SectionPreviousNoteList() {
    return (
        <section>
            <button type="button">
                + agregar nueva nota
            </button>

            <NotePreviewList />
        </section>
    )
}