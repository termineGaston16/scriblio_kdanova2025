import { useCallback, useEffect, useRef, useState } from "react";
import NotePreviewList from "./NotePreviewList";
import FormToCreateNewNote from "./FormToCreateNewNote";
import { Toaster } from "sonner";
import { useListNotesLocalContext } from "../Context/listNotesLocalContext";
import { useGetNotesByQuantity } from "../Hooks/useGetNotesByQuantity";
import AsynchronousResponse from "../../../UI/ASYNCHRONOUS RESPONSE/Presentation/Components/AsynchronousResponse";

export default function SectionPreviousNoteList() {

    const [showFormToCreateNewNote, setShowFormToCreateNewNote] = useState<boolean>(false);

    const { listNoteLocal, setListNoteLocal } = useListNotesLocalContext();
    const lastIDRef = useRef<string | null>(
        listNoteLocal.length > 0 ? listNoteLocal[listNoteLocal.length - 1].id : null
    );

    const { data, isLoading, isFetching, isError, refetch } = useGetNotesByQuantity(lastIDRef.current);

    useEffect(() => {
        if (!data || data.length <= 0) return;
        setListNoteLocal(prevList => [...prevList, ...data]);
    }, [data]);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastNote = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setListNoteLocal(prevList => {
                    const lastID = prevList[prevList.length - 1].id;

                    if (lastID !== lastIDRef.current) {
                        lastIDRef.current = lastID;
                        refetch();
                    }

                    return prevList;
                })
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: .5
        })

        if (node) observerRef.current.observe(node);
    }, []);

    return (<>
        <section style={{ backgroundColor: '#aae1dd' }}>
            <button
                onClick={() => setShowFormToCreateNewNote(true)}
                type="button">
                + agregar nueva nota
            </button>

            <NotePreviewList
                listNoteLocal={listNoteLocal}
                lastNote={lastNote}
            />

            {
                showFormToCreateNewNote &&
                <FormToCreateNewNote
                    closeForm={() => setShowFormToCreateNewNote(false)}
                />
            }

            <Toaster position="bottom-right" />
        </section>

        {
            <AsynchronousResponse
                isLoading={isLoading || isFetching}
                isError={isError}
                loadingComponent={
                    <span>Cargando más notas...</span>
                }
                errorComponent={
                    <span>Error al obtener notas</span>
                }
            />
        }
    </>)
}