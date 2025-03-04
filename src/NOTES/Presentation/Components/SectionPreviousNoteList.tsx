import { useCallback, useEffect, useRef, useState } from "react";
import NotePreviewList from "./NotePreviewList";
import FormToCreateNewNote from "./FormToCreateNewNote";
import { Toaster } from "sonner";
import AsynchronousResponse from "../../../UI/ASYNCHRONOUS RESPONSE/Presentation/Components/AsynchronousResponse";
import { ClassNotes_E } from "../../Domain/classNotes";
import { useLocation } from "react-router-dom";
import { validateLocationToFiltred } from "../../Application/noteAPP";
import { Note_I } from "../../Domain/note";
import { BruteNotesResponse, useGetBruteNotes } from "../Hooks/useGetBruteNotes";
import { useGetFiltredByClassNotes } from "../Hooks/useGetGradesByClassAndByAmount";
import { useQueryClient } from "@tanstack/react-query";

export default function SectionPreviousNoteList() {

    const queryClient = useQueryClient();
    const [showFormToCreateNewNote, setShowFormToCreateNewNote] = useState<boolean>(false);

    const location = useLocation();
    const [currentLinkValue, setCurrentLinkValue] = useState<ClassNotes_E | ''>(validateLocationToFiltred(location.pathname))
    const emptyDataRef = useRef<boolean>(false);

    const [localBruteNotesList, setLocalBruteNotesList] = useState<Note_I[]>(() => {
        return queryClient.getQueryData<BruteNotesResponse>(['bruteNotes'])?.pages.at(-1)?.notes ?? []
    });
    const [localFilteredNotesList, setLocalFilteredNotesList] = useState<Note_I[]>(() => {
        return queryClient.getQueryData<BruteNotesResponse>(['filtredNotes', validateLocationToFiltred(location.pathname)])?.pages.at(-1)?.notes ?? []
    });


    const {
        data: bruteNotes,
        fetchNextPage: fetchNextPageBruteNotes,
        hasNextPage: hasNextPageBruteNotes,
        isLoading: isLoadingBrutesNotes,
        isError: isErrorBrutesNotes
    } = useGetBruteNotes(currentLinkValue);

    const {
        data: filtredNotes,
        fetchNextPage: fetchNextPageFiltredNotes,
        hasNextPage: hasNextPageFiltredNotes,
        isLoading: isLoadingFiltredNotes,
        isError: isErrorFiltredNotes
    } = useGetFiltredByClassNotes(currentLinkValue as ClassNotes_E);

    useEffect(() => {
        setCurrentLinkValue(validateLocationToFiltred(location.pathname))
        emptyDataRef.current = true;
    }, [location.pathname])

    useEffect(() => {
        const lastResponse = bruteNotes?.pages.at(-1);
        if (!lastResponse || lastResponse.length <= 0) return;

        if (emptyDataRef.current) {
            emptyDataRef.current = false;
            setLocalBruteNotesList(lastResponse);
        } else {
            setLocalBruteNotesList(prevList => [...prevList, ...lastResponse]);
        }
    }, [bruteNotes?.pages])

    useEffect(() => {
        const lastResponse = filtredNotes?.pages.at(-1);
        if (!lastResponse || lastResponse.length <= 0) return;

        if (emptyDataRef.current) {
            emptyDataRef.current = false;
            setLocalFilteredNotesList(lastResponse);
        } else {
            setLocalFilteredNotesList(prevList => [...prevList, ...lastResponse]);
        }
    }, [filtredNotes?.pages])

    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastNote = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (currentLinkValue.length <= 0 && hasNextPageBruteNotes) fetchNextPageBruteNotes();
                if (Object.values(ClassNotes_E).includes(currentLinkValue as ClassNotes_E)
                    && hasNextPageFiltredNotes) fetchNextPageFiltredNotes();
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: .1
        })

        if (node) observerRef.current.observe(node);
    }, [hasNextPageBruteNotes]);

    return (<>
        <section style={{ backgroundColor: '#aae1dd' }}>
            <button
                onClick={() => setShowFormToCreateNewNote(true)}
                type="button">
                + agregar nueva nota
            </button>

            <NotePreviewList
                listNoteLocal={
                    currentLinkValue.length <= 0
                        ? localBruteNotesList
                        : Object.values(ClassNotes_E).includes(currentLinkValue as ClassNotes_E)
                            ? localFilteredNotesList
                            : []
                }
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
                isLoading={isLoadingBrutesNotes || isLoadingFiltredNotes}
                isError={isErrorBrutesNotes || isErrorFiltredNotes}
                loadingComponent={
                    <span
                        style={{
                            position: 'absolute',
                            top: '0px',
                            right: '0px',
                            backgroundColor: 'yellow'
                        }}
                    >Cargando más notas...</span>
                }
                errorComponent={
                    <span style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        backgroundColor: 'red'
                    }}>Error al obtener notas</span>
                }
            />
        }
    </>)
}