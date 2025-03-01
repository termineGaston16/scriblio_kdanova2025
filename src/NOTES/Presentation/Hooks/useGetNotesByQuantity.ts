import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import { getNotesByQuantity } from "../../Infraestructure/noteAPI"
import { Note_I } from "../../Domain/note";
import React from "react";

export const useGetNotesByQuantity = (
    lastID: string | null,
    classStyle: string | null
) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['notes'],
        queryFn: () => getNotesByQuantity(lastID),
        gcTime: 60 * 60 * 1000,
        enabled: !classStyle && (!lastID || typeof lastID === 'string'),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 60 * 1000
    });

    React.useEffect(() => {
        if (!query.data || query.data.length <= 0) return;

        queryClient.setQueryData(['notes'], (prevList: Note_I[] = []) => {
            const newData = query.data.filter(note =>
                !prevList.some(prevNote => prevNote.id === note.id)
            );
            return [...prevList, ...newData];
        });
    }, [queryClient, query.data]);

    return query;
};
