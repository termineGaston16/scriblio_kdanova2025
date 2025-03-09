import { useCallback, useEffect, useRef, useState } from "react";
import NotePreviewList from "./NotePreviewList";
import FormToCreateNewNote from "./FormToCreateNewNote";
import { Toaster } from "sonner";
import AsynchronousResponse from "../../../UI/ASYNCHRONOUS RESPONSE/Presentation/Components/AsynchronousResponse";
import { ClassNotes_E } from "../../Domain/classNotes";
import { useLocation } from "react-router-dom";
import { validateLocationToFiltred } from "../../Application/noteAPP";
import { Note_I } from "../../Domain/note";
import { useGetBruteNotes } from "../Hooks/useGetBruteNotes";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useGetFiltredByClassNotes } from "../Hooks/useGetFiltredByClassNotes";
import { useFilterNotesByTag } from "../../../TAG/Presentation/Hooks/useFilterNotesByTag";
import { useIDTagParamContext } from "../../../TAG/Presentation/Context/idTagParamContext";
import { useWordSearchContext } from "../../../UI/TOOLBAR/Presentation/Context/WordSearchContext";
import { useGetNotesByTitle } from "../Hooks/useGetNotesByTitle";

export default function SectionPreviousNoteList() {

    const queryClient = useQueryClient();
    const [showFormToCreateNewNote, setShowFormToCreateNewNote] = useState<boolean>(false);

    const location = useLocation();
    const [currentLinkValue, setCurrentLinkValue] = useState<ClassNotes_E | ''>(validateLocationToFiltred(location.pathname))

    const [localBruteNotesList, setLocalBruteNotesList] = useState<Note_I[]>(() => {
        return queryClient.getQueryData<InfiniteData<Note_I[]>>(['bruteNotes'])?.pages.flat() ?? []
    });

    const [localFilteredNotesList, setLocalFilteredNotesList] = useState<Note_I[]>(() => {
        return queryClient.getQueryData<InfiniteData<Note_I[]>>(['filtredNotes', validateLocationToFiltred(location.pathname)])?.pages.flat() ?? []
    });

    const { idTagParam, showListByTag } = useIDTagParamContext();
    const [localNotesByTag, setLocalNotesByTag] = useState<Note_I[]>(() => {
        return queryClient.getQueryData<InfiniteData<Note_I[]>>(['notesByTag', idTagParam])?.pages.flat() ?? []
    });

    const { wordSearch, showListSearch } = useWordSearchContext();
    const [localNotesByTitle, setLocalNotesByTitle] = useState<Note_I[]>(() => {
        return queryClient.getQueryData<InfiniteData<Note_I[]>>(['notesByTag', wordSearch])?.pages.flat() ?? []
    });

    const {
        data: bruteNotes,
        fetchNextPage: fetchNextPageBruteNotes,
        hasNextPage: hasNextPageBruteNotes,
        isLoading: isLoadingBrutesNotes,
        isError: isErrorBrutesNotes,
        isFetching: isFetchingBrutesNotes
    } = useGetBruteNotes(currentLinkValue);

    const {
        data: filtredNotes,
        fetchNextPage: fetchNextPageFiltredNotes,
        hasNextPage: hasNextPageFiltredNotes,
        isLoading: isLoadingFiltredNotes,
        isError: isErrorFiltredNotes,
        isFetching: isFetchingFiltredNotes
    } = useGetFiltredByClassNotes(currentLinkValue as ClassNotes_E);

    const {
        data: dataNotesByTag,
        fetchNextPage: fetchNextPageNotesByTag,
        hasNextPage: hasNextPageNotesByTag,
        isLoading: isLoadingNotesByTag,
        isError: isErrorNotesByTag,
        isFetching: isFetchingNotesByTag
    } = useFilterNotesByTag(idTagParam);

    const {
        data: dataNotesByTitle,
        fetchNextPage: fetchNextPageNotesByTitle,
        hasNextPage: hasNextPageNotesByTitle,
        isLoading: isLoadingNotesByTitle,
        isError: isErrorNotesByTitle,
        isFetching: isFetchingNotesByTitle
    } = useGetNotesByTitle(wordSearch);

    useEffect(() => {
        setCurrentLinkValue(validateLocationToFiltred(location.pathname))

        setLocalNotesByTag([])
        setLocalNotesByTitle([])
    }, [location.pathname])

    useEffect(() => {
        if (!bruteNotes || bruteNotes.pages.length === 0) return;
        setLocalBruteNotesList(bruteNotes.pages.flat());

        setLocalFilteredNotesList([])
        setLocalNotesByTag([]);
        setLocalNotesByTitle([]);
    }, [bruteNotes?.pages]);

    useEffect(() => {
        if (!filtredNotes || filtredNotes.pages.length === 0) return;
        setLocalFilteredNotesList(filtredNotes.pages.flat());

        setLocalBruteNotesList([]);
        setLocalNotesByTag([]);
        setLocalNotesByTitle([]);
    }, [filtredNotes?.pages]);

    useEffect(() => {
        if (!dataNotesByTag || dataNotesByTag.pages.length <= 0) return;
        setLocalNotesByTag(dataNotesByTag.pages.flat());

        setLocalBruteNotesList([]);
        setLocalFilteredNotesList([]);
        setLocalNotesByTitle([]);
    }, [dataNotesByTag?.pages]);

    useEffect(() => {
        if (!dataNotesByTitle || dataNotesByTitle.pages.length <= 0) return;
        setLocalNotesByTitle(dataNotesByTitle.pages.flat());

        setLocalBruteNotesList([]);
        setLocalFilteredNotesList([]);
        setLocalNotesByTag([]);
    }, [dataNotesByTitle?.pages]);




    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastNote = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {

                if (currentLinkValue.length <= 0 && hasNextPageBruteNotes) fetchNextPageBruteNotes();
                if (Object.values(ClassNotes_E).includes(currentLinkValue as ClassNotes_E)
                    && hasNextPageFiltredNotes) fetchNextPageFiltredNotes();
                if (showListByTag && hasNextPageNotesByTag) fetchNextPageNotesByTag();
                if (showListSearch && hasNextPageNotesByTitle) fetchNextPageNotesByTitle();
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: .1
        })

        if (node) observerRef.current.observe(node);
    }, [
        hasNextPageBruteNotes,
        showListByTag,
        hasNextPageNotesByTag,
        showListSearch,
        hasNextPageNotesByTitle
    ]);

    return (<>
        <section style={{ backgroundColor: '#aae1dd' }}>
            <button
                onClick={() => setShowFormToCreateNewNote(true)}
                type="button">
                + agregar nueva nota
            </button>

            <NotePreviewList
                listNoteLocal={
                    showListSearch ? localNotesByTitle :
                        showListByTag ? localNotesByTag :

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
                isLoading={
                    isLoadingBrutesNotes
                    || isLoadingFiltredNotes
                    || isFetchingBrutesNotes
                    || isFetchingFiltredNotes
                    || isLoadingNotesByTag
                    || isFetchingNotesByTag
                    || isLoadingNotesByTitle
                    || isFetchingNotesByTitle
                }
                isError={
                    isErrorBrutesNotes
                    || isErrorFiltredNotes
                    || isErrorNotesByTag
                    || isErrorNotesByTitle
                }
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