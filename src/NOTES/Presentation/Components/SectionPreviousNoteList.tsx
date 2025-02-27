import { useCallback, useEffect, useRef, useState } from "react";
import NotePreviewList from "./NotePreviewList";
import FormToCreateNewNote from "./FormToCreateNewNote";
import { Toaster } from "sonner";
import { useListNotesLocalContext } from "../Context/listNotesLocalContext";
import { useGetNotesByQuantity } from "../Hooks/useGetNotesByQuantity";
import AsynchronousResponse from "../../../UI/ASYNCHRONOUS RESPONSE/Presentation/Components/AsynchronousResponse";
import { ClassNotes_E } from "../../Domain/classNotes";
import { useLocation } from "react-router-dom";
import { validateLocationToFiltred } from "../../Application/noteAPP";
import { useGetGradesByClassAndByAmount } from "../Hooks/useGetGradesByClassAndByAmount";
import { useQueryClient } from "@tanstack/react-query";
import { Note_I } from "../../Domain/note";

export default function SectionPreviousNoteList() {

    const [showFormToCreateNewNote, setShowFormToCreateNewNote] = useState<boolean>(false);
    const location = useLocation();
    const queryClient = useQueryClient();

    const { listNoteLocal, setListNoteLocal } = useListNotesLocalContext();

    const lastsIDsRef = useRef<{
        allNotes: string | null,
        filtredNotes: string | null
    }>(
        listNoteLocal.length > 0
            ? {
                allNotes: validateLocationToFiltred(location.pathname) === null
                    ? listNoteLocal[listNoteLocal.length - 1].id
                    : null,
                filtredNotes: validateLocationToFiltred(location.pathname) !== null
                    ? listNoteLocal[listNoteLocal.length - 1].id
                    : null
            }
            : {
                allNotes: null,
                filtredNotes: null
            }

    );

    const [filter, setFilter] = useState<{
        classStyle: ClassNotes_E | null,
        whereValue: boolean
    }>({
        classStyle: null,
        whereValue: false
    })

    useEffect(() => {
        setFilter({
            classStyle: validateLocationToFiltred(location.pathname),
            whereValue:
                validateLocationToFiltred(location.pathname) === null
                    ? false
                    : location.pathname !== '/pendientes'

        })
    }, [location.pathname])


    const { data, isLoading, isFetching, isError, refetch } = useGetNotesByQuantity(
        lastsIDsRef.current.allNotes,
        filter.classStyle
    );
    const { data: dataFiltredbyClass, refetch: refetchFiltredByClass } = useGetGradesByClassAndByAmount(
        lastsIDsRef.current.filtredNotes,
        filter.classStyle,
        filter.whereValue
    )

    useEffect(() => {
        if (!data || data.length <= 0) return;
        setListNoteLocal(prevList => {
            if (!filter.classStyle) return data;

            return [...prevList, ...data];
        });
    }, [data]);

    useEffect(() => {
        if (!dataFiltredbyClass || dataFiltredbyClass.length <= 0) return;
        setListNoteLocal(prevList => {
            if (filter.classStyle) return dataFiltredbyClass;

            return [...prevList, ...dataFiltredbyClass];
        });
    }, [dataFiltredbyClass])

    useEffect(() => {
        let lastDatasInCache: Note_I[] = [];

        if (!filter.classStyle) {
            lastDatasInCache = queryClient.getQueryData([
                'notes',
                lastsIDsRef.current.allNotes ?? 'none'
            ]) as Note_I[] || [];
        } else {
            const filteredQueries = queryClient.getQueriesData({
                predicate: (query) => query.queryKey[2] === validateLocationToFiltred(location.pathname)
            });

            lastDatasInCache = filteredQueries.length > 0
                ? (filteredQueries[filteredQueries.length - 1] as Note_I[])
                : [];

            console.log(lastDatasInCache);

        }

        // setListNoteLocal(lastDatasInCache);
    }, [queryClient, filter.classStyle, filter.whereValue]);


    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastNote = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setListNoteLocal(prevList => {
                    const lastID = prevList[prevList.length - 1].id;

                    if (!filter.classStyle) {
                        if (lastID !== lastsIDsRef.current.allNotes) {
                            lastsIDsRef.current.allNotes = lastID;
                            refetch();
                        }
                    } else {
                        if (lastID !== lastsIDsRef.current.filtredNotes) {
                            lastsIDsRef.current.filtredNotes = lastID;
                            refetchFiltredByClass();
                        }
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
    }, [filter.classStyle]);

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