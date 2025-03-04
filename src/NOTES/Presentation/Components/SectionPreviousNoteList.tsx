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
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function SectionPreviousNoteList() {

    const [showFormToCreateNewNote, setShowFormToCreateNewNote] = useState<boolean>(false);
    const location = useLocation();
    const queryClient = useQueryClient();

    const { listNoteLocal, setListNoteLocal } = useListNotesLocalContext();
    const lastIDRef = useRef<string | null>(null)
    const emptyListRef = useRef<boolean>(true)
    const [filter, setFilter] = useState<{
        classStyle: ClassNotes_E | null,
        whereValue: boolean
    }>(() => {
        const currentLocation = validateLocationToFiltred(location.pathname);

        return {
            classStyle: currentLocation,
            whereValue: location.pathname === '/pendientes' ? false : true
        };
    });

    useEffect(() => {
        const currentLocation = validateLocationToFiltred(location.pathname);

        setFilter({
            classStyle: currentLocation,
            whereValue: location.pathname === '/pendientes' ? false : true
        });

        emptyListRef.current = true;
        lastIDRef.current = null;
    }, [location.pathname])

    const { data, isLoading, isFetching, isError, refetch } = useGetNotesByQuantity(
        lastIDRef.current,
        filter.classStyle
    );

    const { data: dataFiltredbyClass, refetch: refetchFiltredByClass, isFetching: isFetchingFiltredByClass } = useGetGradesByClassAndByAmount(
        lastIDRef.current,
        filter.classStyle,
        filter.whereValue
    )

    useEffect(() => {
        if (!data || data.length <= 0) return;

        setListNoteLocal(prevList => {
            if (emptyListRef.current) {
                const lastID = data[data.length - 1]?.id
                lastIDRef.current = lastID;
                emptyListRef.current = false;
                return data;
            }

            return [...prevList, ...data];
        });
    }, [data]);

    useEffect(() => {
        if (!dataFiltredbyClass || dataFiltredbyClass.length <= 0) return;

        setListNoteLocal(prevList => {
            if (emptyListRef.current) {
                const lastID = dataFiltredbyClass[dataFiltredbyClass.length - 1]?.id
                lastIDRef.current = lastID;
                emptyListRef.current = false;
                return dataFiltredbyClass;
            }

            return [...prevList, ...dataFiltredbyClass];
        });
    }, [dataFiltredbyClass])

    useEffect(() => {
        if (data || dataFiltredbyClass) return;
        let dataInCache;

        if (!filter.classStyle) {
            dataInCache = queryClient.getQueryData(['allNotes']);
        } else {
            dataInCache = queryClient.getQueryData([
                'allNotesFiltred',
                filter.classStyle,
                filter.whereValue]);
        }

        console.log(dataInCache);

        if (!Array.isArray(dataInCache)) return;
        setListNoteLocal(dataInCache);

    }, [location.pathname, filter.classStyle, filter.whereValue])

    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastNote = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setListNoteLocal(prevList => {
                    const lastID = prevList[prevList.length - 1].id;

                    if (lastID !== lastIDRef.current) {
                        if (!filter.classStyle) refetch();
                        if (filter.classStyle) refetchFiltredByClass();

                        lastIDRef.current = lastID;
                    }

                    return prevList;
                })
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: .1
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
                isLoading={isLoading || isFetching || isFetchingFiltredByClass}
                isError={isError}
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