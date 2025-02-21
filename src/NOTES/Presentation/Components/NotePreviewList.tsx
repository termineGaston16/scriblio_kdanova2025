import NotePreview from "./NotePreview";

export default function NotePreviewList() {
    return (
        <ul>
            <li>
                <NotePreview
                    title={'Título de la nota'}
                    date={'Fecha de creación/modificación'}
                    id={12}
                />
            </li>
            <li>
                <NotePreview
                    title={'Título de la nota 2'}
                    date={'Fecha de creación/modificación'}
                    id={21}
                />
            </li>
            <li>
                <NotePreview
                    title={'Título de la nota 3'}
                    date={'Fecha de creación/modificación'}
                    id={44}
                />
            </li>
        </ul>
    )
}